function getFilePath(files) {
    const filePath = files.map((file) => file.path + `.${file.mimetype.split("/")[1]}`)
    const fileSplit = filePath.map(path => path.split("\\"))
    return fileSplit.map(r => `${r[1]}/${r[2]}`);

}
module.exports = {
    getFilePath
}