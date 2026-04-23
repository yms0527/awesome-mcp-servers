
package smartagent;

import org.bukkit.plugin.java.JavaPlugin;

public class SmartAgentPlugin extends JavaPlugin {
    @Override
    public void onEnable() {
        getLogger().info("Smart Agent Plugin Enabled!");
        // Initialize connection to AI agent server (mocked)
    }

    @Override
    public void onDisable() {
        getLogger().info("Smart Agent Plugin Disabled.");
    }
}
