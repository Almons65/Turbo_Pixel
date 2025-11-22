# Turbo_Pixel
**Image Filter WebAssembly**


## Project Description
Turbo Pixel is a web application that lets you edit photos instantly right in your browser. Usually, editing photos on the web can be a bit slow because standard web languages aren't built for heavy calculation tasks.

Turbo Pixel solves this by using a powerful technology called WebAssembly, which is built with the Rust programming language. This allows the website to run as fast as a professional program you would download to your desktop.


## Key Features
**1. Instant Filters**
- No Waiting: When you click a filter, the change happens immediately. There are no loading bars or spinning wheels.
- Fun Effects: You can instantly turn your photos Black & White, Sepia (vintage style), or Invert the colors.
- Edge Detection: There is a special "Edge" filter that finds the outlines of objects in your photo, making it look like a digital sketch.

**2. Smooth Sliders**
- Blur Control: You aren't stuck with just one "blur" setting. You can use a slider to make the image just a tiny bit soft, or completely fuzzy, and it updates smoothly as you drag the handle.
- Brightness: You can fix dark photos or dim bright ones using the brightness slider.

**3. Speed Calculation**
- Speedometer: To prove how fast the app is, there is a built-in timer at the top of the screen. Every time you make a change, it calculates exactly how long it took (usually just a few milliseconds!). It’s like a speedometer for your image editor.

**4. Easy to Use**
- Split View: The controls are on the left, and your image is on the right, so you always have a clear view of your work.
- Reset & Download: Made a mistake? Hit the reset button. Happy with your edit? Download the new image directly to your computer.


## Technical Highlights (How it Works)

**1. The Engine: Rust & WebAssembly (WASM)**
- Think of JavaScript (the standard language of the web) as a general-purpose worker. It's good at many things, but not great at heavy lifting.
- Rust is like a specialized power tool. We used Rust to write the math that changes the pixels in your image.
- We then wrap that Rust code in WebAssembly, which lets the web browser run that "power tool" safely and incredibly fast.

**Pixel-by-Pixel Control**
- This app doesn't just use pre-made web filters. The code actually looks at every single tiny dot (pixel) in your picture.
- It reads the Red, Green, and Blue colors of every dot and changes them individually using math. Because we used Rust, we can do millions of these math problems in the blink of an eye.

**Modern Design**
- We built the visual part of the website using Next.js. This makes the buttons, sliders, and layout look modern and feel snappy when you click them.
- The "Turbo" theme uses glowing colors and animations to match the high-speed performance of the code underneath.


## ScreenShot





<img width="1919" height="987" alt="image" src="https://github.com/user-attachments/assets/7c8ddd31-2d24-44b3-9065-321806c176ce" />


