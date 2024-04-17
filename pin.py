
import pyautogui
import time
import keyboard

def run_code():
    # Perform a single click at another specified point to deselect the input field
    x1 = 1100
    y1 = 450
    pyautogui.click(x1, y1)

    x1 = 950
    y1 = 700
    pyautogui.click(x1, y1)

    x1 = 800
    y1 = 620
    pyautogui.click(x1, y1)

    x1 = 1000
    y1 = 500
    pyautogui.click(x1, y1)

# Wait for the window to minimize
time.sleep(1)

# Listen for Ctrl+Alt+B combination
while True:
    if keyboard.is_pressed('ctrl+alt+3'):
        run_code()
        time.sleep(1)  # To prevent multiple executions due to key hold
