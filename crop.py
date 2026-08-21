from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

img = Image.open(r'C:\Users\ELCOT\.gemini\antigravity\brain\69837d86-b94d-4a55-8a3d-de1cc01345d0\.user_uploaded\media_1787298562919.png')
left_half = img.crop((0, 0, 500, 1024))
trimmed = trim(left_half)
size = max(trimmed.size)
padded = Image.new(img.mode, (size, size), img.getpixel((0,0)))
padded.paste(trimmed, ((size - trimmed.size[0]) // 2, (size - trimmed.size[1]) // 2))

padded = padded.convert('RGBA')
datas = padded.getdata()
newData = []
bg_color = padded.getpixel((0,0))
for item in datas:
    if abs(item[0] - bg_color[0]) < 10 and abs(item[1] - bg_color[1]) < 10 and abs(item[2] - bg_color[2]) < 10:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)
padded.putdata(newData)

padded.save('public/zenviq-icon.png', 'PNG')
padded.resize((64, 64)).save('public/favicon.ico', format='ICO')
