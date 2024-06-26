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

Navigate to [https://github.com/AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#installation-and-running) and follow the installation guide. When starting the server, make sure to enable the `--api` flag so it also creates a web API which the app can connect to. The defaults should work, if not adjust server address in app.

### Ollama LLaVa

Navigate to [https://ollama.com/](https://ollama.com/) and install Ollama. Follow the instructions and download [https://ollama.com/library/llava](https://ollama.com/library/llava) model. If you run hosted web version of app make sure to add it to Ollama CORS [https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama](https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-allow-additional-web-origins-to-access-ollama)

## On-Device

Currently, it is not possible to configure on-device models as they are enabled by default.
