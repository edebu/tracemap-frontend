# 🌐 TraceMap Frontend

TraceMap is a visual network tracing tool that maps the path of internet connections. Visualize traceroutes on an interactive global map and explore the physical journey of your data packets across the internet.

## ✨ Features

- 🗺️ **Visual Traceroute:** See the geographical path your internet traffic takes
- 🔄 **Real-time Mapping:** Plot each hop on an interactive dark-themed map
- 📊 **Detailed Hop Information:** View IP, city, and country for each network hop
- 🌙 **Dark Mode Interface:** Easy on the eyes with a sleek dark theme
- 🔍 **Multiple Map Layers:** Choose from different dark map styles
- 📱 **Responsive Design:** Works on desktop and mobile devices

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

> **Note:** This is the client-side portion of TraceMap. You'll also need to run the server component for full functionality.

## 🎮 How to Use

1. **Enter a Domain or IP Address**
   - Type a domain name (e.g., `google.com`) or IP address (e.g., `8.8.8.8`) in the input field
   - Press Enter or click the "Trace" button

2. **View the Traceroute Results**
   - The map will display markers for each hop in the route
   - A line will connect the hops to show the path
   - The sidebar will list details about each hop

3. **Interact with the Map**
   - Zoom in/out to explore the path in detail
   - Click on markers to see more information about each hop
   - Use the layer selector in the top-right to change map styles

## 🧩 Project Structure

```
client/
├── public/              # Static files
├── src/                 # Source code
│   ├── app/             # Next.js app directory
│   │   ├── page.tsx     # Main application page
│   │   ├── MapView.tsx  # Map component wrapper
│   │   └── MapComponent.tsx  # Leaflet map implementation
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the client directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Dependencies

This project is built with:
- [Next.js](https://nextjs.org) - React framework
- [React-Leaflet](https://react-leaflet.js.org) - React components for Leaflet maps
- [Axios](https://axios-http.com) - HTTP client for API requests
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 💻 Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🌟 Advanced Usage

### Custom Tile Servers

TraceMap supports multiple map tile providers. You can add additional tile servers by editing the `darkTileLayers` array in `MapComponent.tsx`.

### Performance Optimization

For tracing to large destinations with many hops, the application implements:
- Parallel API requests with Promise.all
- Conditional rendering
- Optimized map rendering with proper bounds handling

## 📝 License

This project is licensed under the MIT License.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

Built with ❤️ for network visualization
