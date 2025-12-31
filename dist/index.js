"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./routes/auth"));
const notes_1 = __importDefault(require("./routes/notes"));
const dev_1 = __importDefault(require("./routes/dev"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/notes', notes_1.default);
const likes_1 = __importDefault(require("./routes/likes"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const admin_1 = __importDefault(require("./routes/admin"));
const ratings_1 = __importDefault(require("./routes/ratings"));
const comments_1 = __importDefault(require("./routes/comments"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const drive_1 = __importDefault(require("./routes/drive"));
app.use('/api', likes_1.default);
app.use('/api', dev_1.default);
app.use('/api', ratings_1.default);
app.use('/api', comments_1.default);
app.use('/api/uploads', uploads_1.default);
app.use('/api/drive-upload', drive_1.default);
app.use('/api/profiles', profiles_1.default);
app.use('/api/admin', admin_1.default);
// Serve uploaded files directly (development use)
app.use('/uploads', express_1.default.static('uploads'));
server.listen(config_1.PORT, async () => {
    console.log(`Server running on port ${config_1.PORT}`);
    try {
        await mongoose_1.default.connect(config_1.MONGODB_URI);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
});
exports.default = server;
