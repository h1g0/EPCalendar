import os
import requests
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import epaper

load_dotenv()


def main():
    IMAGE_URL = os.getenv("IMAGE_URL")
    EPAPER_MODEL = os.getenv("EPAPER_MODEL")

    if not IMAGE_URL:
        print("ERROR: IMAGE_URL is not set in the .env file.")
        return

    if not EPAPER_MODEL:
        print("ERROR: EPAPER_MODEL is not set in the .env file.")
        return

    try:
        response = requests.get(IMAGE_URL)
        response.raise_for_status()

        image = Image.open(BytesIO(response.content))

        epd = epaper.epaper(EPAPER_MODEL).EPD()
        epd.init()
        epd.display(epd.getbuffer(image))
        epd.sleep()

        print("Image successfully displayed on the e-paper.")
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch the image: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
