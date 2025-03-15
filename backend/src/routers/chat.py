from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import datetime
import uuid

router = APIRouter()

active_connections: dict[str, dict[str, list[WebSocket]]] = {}
ephemeral_messages: dict[str, dict[str, list[dict]]] = {}


async def delete_ephemeral_message(client_id: str, message_id: str):
    await asyncio.sleep(60)
    room_id = "global_chat"  # Fixed room ID
    if room_id in ephemeral_messages and client_id in ephemeral_messages[room_id]:
        ephemeral_messages[room_id][client_id] = [
            msg for msg in ephemeral_messages[room_id][client_id] if msg["id"] != message_id
        ]


@router.websocket("/ws/{client_id}")  # Removed room_id from path
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    room_id = "global_chat"  # Fixed room ID
    try:
        await websocket.accept()
        if room_id not in active_connections:
            active_connections[room_id] = {}
        if client_id not in active_connections[room_id]:
            active_connections[room_id][client_id] = [
                websocket
            ]  # Corrected line
        else:
            active_connections[room_id][client_id].append(websocket)
        try:
            while True:
                data = await websocket.receive_json()
                message_id = str(uuid.uuid4())
                message = {
                    "id": message_id,
                    "message": data["message"],
                    "username": data["username"],
                    "timestamp": datetime.datetime.now().isoformat(),
                }
                if room_id not in ephemeral_messages:
                    ephemeral_messages[room_id] = {}
                if client_id not in ephemeral_messages[room_id]:
                    # Corrected line
                    ephemeral_messages[room_id][client_id] = []
                ephemeral_messages[room_id][client_id].append(message)
                for client_sockets in active_connections[room_id].values():
                    for connection in client_sockets:
                        await connection.send_json(message)
                asyncio.create_task(
                    delete_ephemeral_message(client_id, message_id)
                )  # Removed room_id
        except WebSocketDisconnect:
            if room_id in active_connections and client_id in active_connections[room_id]:
                active_connections[room_id][client_id].remove(websocket)
                if not active_connections[room_id][client_id]:
                    del active_connections[room_id][client_id]
                if not active_connections[room_id]:
                    del active_connections[room_id]
    except Exception as e:
        print(f"WebSocket Error: {e}")
