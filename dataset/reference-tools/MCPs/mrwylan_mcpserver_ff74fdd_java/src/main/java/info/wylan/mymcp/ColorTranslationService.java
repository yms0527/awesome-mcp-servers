package info.wylan.mymcp;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ColorTranslationService {

    private final HexColor DEFAULT_COLOR = new HexColor("schwarz", "#000000");
    private final List<HexColor> wellknownColors = new ArrayList<>();

    @PostConstruct
    private void initializeDefaultColors() {
        // Grundlegende Farben
        wellknownColors.add(DEFAULT_COLOR);
        wellknownColors.add(new HexColor("rot", "#FF0000"));
        wellknownColors.add(new HexColor("grün", "#00FF00"));
        wellknownColors.add(new HexColor("blau", "#0000FF"));
        wellknownColors.add(new HexColor("gelb", "#FFFF00"));
        wellknownColors.add(new HexColor("weiß", "#FFFFFF"));
        wellknownColors.add(new HexColor("grau", "#808080"));
        wellknownColors.add(new HexColor("violett", "#800080"));
        wellknownColors.add(new HexColor("orange", "#FFA500"));
    }

    @Tool(name = "my_mcp_colors", description = "Get a list of well known colors.")
    public List<HexColor> getWellknownColors() {
        return wellknownColors;
    }

    @Tool(name = "my_mcp_color", description = "Get the single color name and hex value representation.")
    public HexColor getColorHex(String colorName) {
        if (colorName == null) {
            return DEFAULT_COLOR;
        }
        return wellknownColors.stream().filter(hc -> hc.colorName().equalsIgnoreCase(colorName)).findFirst().orElse(DEFAULT_COLOR);
    }

    /**
     * Fügt eine neue Farbe zum Service hinzu
     * @param colorName Der Name der Farbe
     * @param hexValue Der Hex-Wert der Farbe (Format: #RRGGBB)
     * @return true wenn die Farbe hinzugefügt wurde, false wenn der Hex-Wert ungültig ist
     */
    @Tool(name = "my_mcp_add_color", description = "Add a new color with according hex representation to the service.")
    public boolean addColor(String colorName, String hexValue) {
        if (isValidHexColor(hexValue)) {
            return wellknownColors.add(new HexColor(colorName,hexValue));
        }
        return false;
    }

    private boolean isValidHexColor(String hexValue) {
        return hexValue != null && hexValue.matches("^#[0-9A-Fa-f]{6}$");
    }
}