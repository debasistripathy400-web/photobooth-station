import cv2
import numpy as np
import os

def remove_background(image_path, output_path, bg_color='black'):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        return
    
    # Convert to BGRA
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    
    # Create mask for background
    if bg_color == 'black':
        # Threshold to find black (dark) areas
        gray = cv2.cvtColor(img[:,:,:3], cv2.COLOR_BGR2GRAY)
        mask = gray > 10
    elif bg_color == 'grey':
        # Find grey areas (around 128,128,128 or similar)
        # Based on the image, the grey is around [180, 180, 180] maybe?
        # Let's use a range
        lower = np.array([150, 150, 150])
        upper = np.array([210, 210, 210])
        mask = cv2.inRange(img[:,:,:3], lower, upper)
        mask = cv2.bitwise_not(mask)
    else:
        # Default fallback: assume white/light background
        gray = cv2.cvtColor(img[:,:,:3], cv2.COLOR_BGR2GRAY)
        mask = gray < 240
    
    # Set alpha channel based on mask
    img[:, :, 3] = np.where(mask > 0, 255, 0).astype(np.uint8)
    
    # Soften edges
    # img = cv2.GaussianBlur(img, (3,3), 0) # This might blur the whole image, skip for now
    
    cv2.imwrite(output_path, img)

# Process current props
props_dir = 'c:/Users/DEBASIS/OneDrive/Desktop/photo booth/frontend/public/props/'
# New glasses with black bg
remove_background('c:/Users/DEBASIS/.gemini/antigravity/brain/a485a8e5-423d-4ed4-abf2-574283a7d029/thug_life_glasses_black_bg_1774360691663.png', props_dir + 'glasses.png', 'black')
remove_background(props_dir + 'crown.png', props_dir + 'crown.png', 'black')
remove_background(props_dir + 'mask.png', props_dir + 'mask.png', 'black')
