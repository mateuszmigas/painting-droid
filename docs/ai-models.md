# AI Models

To add models, go to app settings and click on the Models tab. Simply select the model from the dropdown, add it, and configure the necessary fields. More model providers will be added in the future. Feel free to request one on [https://github.com/mateuszmigas/painting-droid/discussions/56.](https://github.com/mateuszmigas/painting-droid/discussions/56)

{% hint style="info" %}
Models using API keys need a desktop version for secure storage
{% endhint %}

## Cloud

### OpenAI DALL-E 2/3

Navigate to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) to generate API Key and add provider with key in app.

### Stability.ai

Navigate to [https://platform.stability.ai](https://platform.stability.ai/) to generate API Key and add model with key in app.

## Self-Hosted

### Stable Diffusion WebUI

1. Navigate to [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) and follow the installation guide.&#x20;
2. When starting the app, make sure to enable the `--api` flag so it also creates a web API which the app can connect to. Check this [link](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API#api-guide-by-kilvoctu) for details.
3. The defaults should work, if not adjust server address in model settings.

### Ollama LLaVa

1. Navigate to [https://ollama.com/](https://ollama.com/) and install Ollama.&#x20;
2. Download llava model and run `ollama pull llava` to pull [ollava](https://ollama.com/library/llava) model.
3. If you run hosted web version (from [https://www.paintingdroid.com/](https://www.paintingdroid.com/)) of app make sure to add it to Ollama CORS. For example on macOS:\
   `launchctl setenv OLLAMA_ORIGINS "https://www.paintingdroid.com"`. Check [link](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama) for details.
4. The defaults should work, if not adjust server address in model settings.

## On-Device

Currently, it is not possible to configure on-device models as they are enabled by default.
