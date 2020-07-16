import path from "path"
import multer from "multer"

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp'),
    filename(request, file, callback) {
      callback(null, file.originalname)
    }
  })
}