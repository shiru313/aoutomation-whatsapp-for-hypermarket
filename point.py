import pygetwindow as gw
import pyautogui
import time

# Disable PyAutoGUI fail-safe
pyautogui.FAILSAFE = False

def activate_window_by_title(window_title):
    windows = gw.getAllWindows()
    for window in windows:
        if window._hWnd and window.title.lower() == window_title.lower():
            window.activate()
            return True
    return False

def read_phone_number_from_file(file_path):
    with open(file_path, 'r') as file:
        return file.read().strip()

# Replace 'LithosERP POS' with the window title of your application
window_title = 'LithosERP POS'
phone_number_file_path = 'number3.txt'

if activate_window_by_title(window_title):
    # Press the "Enter" key
    pyautogui.press("enter")
    
    # Wait for the window to become active
    time.sleep(1)

    # Define the coordinates of the point to double-click
    x = 500
    y = 150

    # Perform a double-click at the specified point
    pyautogui.doubleClick(x, y)
    time.sleep(1)

    # Read the phone number from the text file
    phone_number = read_phone_number_from_file(phone_number_file_path)
    
    # Type the phone number using pyautogui
    pyautogui.typewrite(phone_number)
    time.sleep(1)
    
    # Perform a double-click at another specified point to deselect the input field
    x1 = 80
    y1 = 100
    pyautogui.doubleClick(x1, y1)

    # Press the "Enter" key
    pyautogui.press("enter")

    # Wait a moment for the action to take effect
   

    # Define the coordinates of the region you want to capture
    left = 80
    top = 80
    width = 470
    height = 240
    time.sleep(0.5)

    # Capture the specified region
    screenshot = pyautogui.screenshot(region=(left, top, width, height))

    # Save the screenshot
    screenshot.save("point.png")

    print("Screenshot saved successfully.")
    # Minimize the window
    gw.getWindowsWithTitle(window_title)[0].minimize()

else:
    print("Window not found or could not be activated.")
