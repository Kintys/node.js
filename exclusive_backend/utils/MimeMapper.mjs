class MimeMapper {
    static createMaps() {
        const extensionToMimeMap = new Map([
            [".ico", "image/x-icon"],
            [".html", "text/html"],
            [".js", "text/javascript"],
            [".json", "application/json"],
            [".css", "text/css"],
            [".png", "image/png"],
            [".jpg", "image/jpeg"],
            [".wav", "audio/wav"],
            [".mp3", "audio/mpeg"],
            [".svg", "image/svg+xml"],
            [".pdf", "application/pdf"],
            [".doc", "application/msword"],
        ]);

        const mimeToExtensionMap = new Map(
            Array.from(extensionToMimeMap).map(([extension, mimeType]) => [mimeType, extension])
        );

        return { extensionToMimeMap, mimeToExtensionMap };
    }

    static getMimeType(extension) {
        const { extensionToMimeMap } = this.createMaps();
        return extensionToMimeMap.get(extension) || "application/octet-stream";
    }

    static getExtension(mimeType) {
        const { mimeToExtensionMap } = this.createMaps();
        return mimeToExtensionMap.get(mimeType) || null;
    }
}
export default MimeMapper;
