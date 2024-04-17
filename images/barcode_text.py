import cv2
from pyzbar.pyzbar import decode
import pygetwindow as gw
import pyautogui
import time


def read_barcode(image_path):
    # Read the image
    image = cv2.imread(image_path)

    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use pyzbar to decode the barcode
    decoded_objects = decode(gray_image)

    # Extract the text from the barcode
    barcode_text = None
    for obj in decoded_objects:
        barcode_text = obj.data.decode('utf-8')
        break  # Assuming only one barcode in the image

    return barcode_text

# Path to the barcode image
barcode_image_path = 'barcode.jpg'

# Read the barcode image and extract the text
barcode_text = read_barcode(barcode_image_path)

if barcode_text:
    print( barcode_text)
else:
    print("No barcode found in the image.")

    

pyautogui.FAILSAFE = False


def activate_window_by_title(window_title):
    windows = gw.getAllWindows()
    for window in windows:
        if window._hWnd and window.title.lower() == window_title.lower():
            window.activate()
            return True
    return False

# Replace 'LithosERP POS' with the window title of your application
window_title = 'LithosERP POS'
if activate_window_by_title(window_title):
    pyautogui.press("enter")
    # Wait for the window to become active
    time.sleep(1)

    # Read the number from the text file


     # Define the coordinates of the point to double-click
    x = 30
    y = 100

    # Perform a double-click at the specified point
    pyautogui.doubleClick(x, y)    

    # Type the number using pyautogui
    pyautogui.typewrite(barcode_text)

    # Press the "Enter" key
    pyautogui.press("enter")

    # Wait a moment for the action to take effect
    time.sleep(1)

    # Define the coordinates of the region you want to capture
    left = 550
    top = 100
    width = 800
    height = 950

    # Capture the specified region
    screenshot = pyautogui.screenshot(region=(left, top, width, height))

    # Save the screenshot
    screenshot.save("price.png")

    print("Screenshot saved successfully.")
    gw.getWindowsWithTitle(window_title)[0].minimize()
    

else:
    print("Window not found or could not be activated.")
