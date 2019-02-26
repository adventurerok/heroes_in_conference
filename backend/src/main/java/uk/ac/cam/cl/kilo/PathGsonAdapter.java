package uk.ac.cam.cl.kilo;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.nio.file.Path;

public class PathGsonAdapter implements JsonSerializer<Path> {

    private final Path staticFilePath;

    public PathGsonAdapter(Path staticFilePath) {
        this.staticFilePath = staticFilePath.toAbsolutePath();
    }

    @Override
    public JsonElement serialize(Path path, Type type, JsonSerializationContext jsonSerializationContext) {
        return new JsonPrimitive(staticFilePath.relativize(path.toAbsolutePath()).toString());
    }
}
