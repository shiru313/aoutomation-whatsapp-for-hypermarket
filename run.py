import subprocess
import time
def run():
    file_path = r'C:\Users\User\Barcode\lets.js'
    node_process = subprocess.Popen(['node ', file_path])
    time.sleep(6)
    node_process.terminate()
run()   

