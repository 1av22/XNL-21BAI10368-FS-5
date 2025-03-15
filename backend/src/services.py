import cloudinary.uploader
import cloudinary
import os
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

analyzer = SentimentIntensityAnalyzer()


def upload_video_to_cloudinary(file_path):
    upload_result = cloudinary.uploader.upload(
        file_path, resource_type="video", folder="xnl-task")
    return upload_result["secure_url"]


def analyze_sentiment(text):
    return analyzer.polarity_scores(text)
