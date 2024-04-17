import win32print
import win32ui
import win32con

def print_text(text, printer_name):
    printer_handle = win32print.OpenPrinter(printer_name)
    try:
        hprinter = win32print.GetPrinter(printer_handle, 2)
        dpi = 300
        hDC = win32ui.CreateDC()
        hDC.CreatePrinterDC(printer_name)
        hDC.StartDoc('Test Document')
        hDC.StartPage()

        font = win32ui.CreateFont({
            "name": "Arial",
            "height": int(14 * dpi / 72),
            "weight": 400
        })
        hDC.SelectObject(font)

        x = int(0.1 * dpi)
        y = int(0.1 * dpi)
        for line in text.split("\n"):
            hDC.TextOut(x, y, line)
            y += int(0.2 * dpi)

        hDC.EndPage()
        hDC.EndDoc()

    finally:
        win32print.ClosePrinter(printer_handle)

def print_text_from_file(file_path, printer_name):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text_to_print = file.read()
            print_text(text_to_print, printer_name)
    except FileNotFoundError:
        print("File not found.")

# Example usage:
file_path = "message.txt"  # Update this with the actual file path
printer_name = "POS-80 (copy 2)"

print_text_from_file(file_path, printer_name)
