# Create-React-App based LAN Video Streaming Server & UI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To run the server

Make sure to update the `.env` file's `HOST_IP` to the ip or hostname of your server (where you are running this app)\
Can be something like `192.168.x.x` or `localhost`, etc.

```env
HOST_IP=192.168.x.x
```

You must also specify a default mp4 file path in the `.env` file:

```env
DEFAULT_VIDEO_PATH=<path to mp4 file>
```


## Available Scripts

In the project directory after installing dependencies with `npm install`, you can run:

### `npm run serve`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser, or use the IP of the server in the address bar, such as `http://192.168.x.x:3000`.

The page will reload if you make edits.\
You will also see any lint errors in the console.
