import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
dotenv.config();
module.exports = function (app: any) {
	app.use(
		'/video',
		createProxyMiddleware({
			target: `http://${process.env.HOST_IP}:8000/video`,
			changeOrigin: true,
		})
	);
	app.use(
		'/search',
		createProxyMiddleware({
			target: `http://${process.env.HOST_IP}:8000/search`,
			changeOrigin: true,
		})
	);
	app.use(
		'/select',
		createProxyMiddleware({
			target: `http://${process.env.HOST_IP}:8000/select`,
			changeOrigin: true,
		})
	);
};
