const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const syncToAsync = require('../utils/syncToAsync');
const sqip = syncToAsync(require('sqip'));

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const REALATIVE_PATH = `static/images/`;
const FOLDER = path.join(process.cwd(), REALATIVE_PATH);
// const types = ['jpg', 'jpeg', 'png', 'gif'];

// const result =  sqip({
//     filename: `./${REALATIVE_PATH}/1.jpg`,
//     numberOfPrimitives: 8
// });
// returns { final_svg, svg_base64encoded, img_dimensions }

// const thumbSize = 16;
const scaleFactor = 0.05;
const options = {
    kernel: 'cubic',
    interpolator: 'nohalo'
}
const blurRadius = 0;
const blurDeviation = 1;

function processFile(fileName) {
    var fileData = {
        filePath: 'images/' + fileName,
        originalWidth: null,
        originalHeight: null,
        base64: null,
        format: null
    };

    let image = sharp(FOLDER + fileName);

    return image
        .metadata()
        .then(metadata => {
            var { width, height, format} = metadata;
            fileData.originalWidth = width;
            fileData.originalHeight = height;
            fileData.format = format;
            return Promise.all([
                image
                    .resize(
                        Math.round(width * scaleFactor),
                        Math.round(height * scaleFactor)
                    )
                    .blur(1.3)
                    .toBuffer(),
                sqip({
                    filename: FOLDER + fileName,
                    numberOfPrimitives: 32
                })
            ]);
        })
        .then(([data, sqipData]) => {
            fileData.base64 = `data:image/${fileData.format};base64,${data.toString('base64')}`;
            fileData.sqip = sqipData;
            return fileData;
        })
}

const imageService = {
    getAll() {
        return readDir(FOLDER)
            .then(fileNames => Promise.all(fileNames.map(processFile)))
    }
};

module.exports = imageService;