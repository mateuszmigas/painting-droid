# AI Models

To add models, go to app settings and click on the Models tab. Simply select the model from the dropdown, add it, and configure the necessary fields. More model providers will be added in the future. Feel free to request one on [https://github.com/mateuszmigas/painting-droid/discussions/56.](https://github.com/mateuszmigas/painting-droid/discussions/56)

{% hint style="info" %}
Models using API keys need a desktop version for secure storage
{% endhint %}

## Cloud

### OpenAI DALL-E 2/3

1. Navigate to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) to generate API Key.
2. Add OpenAI provider with this API Key in app settings.

### Stability.ai

1. Navigate to [https://platform.stability.ai](https://platform.stability.ai/) to generate API Key.
2. Add Stability.ai provider with this API Key in app settings.

## Self-Hosted

### Stable Diffusion WebUI

1. Navigate to [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) and follow the installation guide.&#x20;
2. When starting the app, make sure to enable the `--api` flag so it also creates a web API which the app can connect to. Check this [link](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API#api-guide-by-kilvoctu) for details.
3. The defaults should work, if not adjust server address in model settings.

### Ollama LLaVa

1. Navigate to [https://ollama.com/](https://ollama.com/) and install Ollama.&#x20;
2. Run `ollama pull llava` to pull [ollava](https://ollama.com/library/llava) model
3. If you run hosted web version (from [https://www.paintingdroid.com/](https://www.paintingdroid.com/)) of app make sure to add it to Ollama CORS. For example on macOS:\
   `launchctl setenv OLLAMA_ORIGINS "https://www.paintingdroid.com"`. Check [link](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama) for details.
4. The defaults should work, if not adjust server address in model settings.

### llmman LLaVa

[llmman](https://github.com/llmmanorg/llmman) is a local model runner that serves the Ollama API on port 17434, so it works the same way as the Ollama model above.

1. Install llmman: `curl -fsSL https://raw.githubusercontent.com/llmmanorg/llmman/main/install.sh | sh` (Linux/macOS) or `irm https://raw.githubusercontent.com/llmmanorg/llmman/main/install.ps1 | iex` (Windows).
2. The app requests the model named `llava`, so alias that name to a LLaVA GGUF and pull it, for example:\
   `llmman config set aliases.llava hf.co/second-state/Llava-v1.5-7B-GGUF` and then `llmman pull llava`.
3. Run `llmman serve`.
4. The defaults should work, if not adjust server address in model settings (default `http://localhost:17434/api/generate`).

## On-Device

Currently, it is not possible to configure on-device models as they are enabled by default.
