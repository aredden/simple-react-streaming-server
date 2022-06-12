import express from 'express';
import fs from 'fs';
import * as tslog from 'tslog';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();
const logger = new tslog.Logger({
	name: 'video-server',
	colorizePrettyLogs: true,
});
const CHUNK_SIZE = 1024 * 1024 * 4;
if (!process.env.DEFAULT_VIDEO_PATH) {
	throw new Error('DEFAULT_VIDEO_PATH is not set');
}
let VIDEO_PATH = process.env.DEFAULT_VIDEO_PATH as string;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/video', function (req, res) {
	const range = req.headers.range;
	if (!range) {
		res.status(400).send('Requires Range header');
		return;
	}
	VIDEO_PATH = VIDEO_PATH.replace('//', '/');
	const videoSize = fs.statSync(VIDEO_PATH).size;

	const start = Number(range.replace(/\D/g, ''));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
	const contentLength = end - start + 1;
	const headers = {
		'Content-Range': `bytes ${start}-${end}/${videoSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': contentLength,
		'Content-Type': 'video/mp4',
	};
	res.writeHead(206, headers);
	const videoStream = fs.createReadStream(VIDEO_PATH, { start, end });
	videoStream.pipe(res);
});

app.post('/search', async function (req, res) {
	logger.debug(req.body);
	const { query } = req.body;
	if (!query) {
		res.status(400).send('Requires query');
		return;
	}
	let folderName = '';
	let unresolved = '';
	query.split('/').forEach((file: string) => {
		if (fs.existsSync(folderName + '/' + file)) {
			folderName += '/' + file;
		} else {
			unresolved = file;
		}
	});
	try {
		if (fs.statSync(folderName).isDirectory()) {
			let files = fs.readdirSync(folderName, { withFileTypes: true });
			if (unresolved != '') {
				let filesResolved: (string | undefined)[] = files
					.filter((e) => e.name.startsWith(unresolved))
					.map((value) => (value.isDirectory() ? value.name + '/' : value.isFile() ? value.name : undefined))
					.filter((e) => e)
					.slice(0, 100) as string[];
				res.send({
					files: filesResolved,
					filePaths: filesResolved.map((file) => folderName + '/' + file),
				});
			} else if (files.length > 0) {
				res.send({
					files: files.slice(0, 100).map((e) => e.name),
					filePaths: files.slice(0, 100).map((file) => {
						return folderName + '/' + file.name;
					}),
				});
			} else {
				res.send({
					files: [],
					filePaths: [],
				});
			}
		} else {
			res.send({
				files: [folderName],
				filePaths: [folderName + '/'],
			});
		}
	} catch (e) {
		logger.debug(`Error occurred: ${e}`);
		res.send({
			files: [],
		});
	}
});

app.post('/select', (req, res) => {
	logger.debug(req.body);
	const { fileName } = req.body;
	VIDEO_PATH = fileName;
	res.status(200).send({ ok: true });
});

app.listen(8000, function () {
	logger.info('Listening on port 8000!');
});
