export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://cdn.profitbase.ru/smart/sw.js'
    script.onload = () => {
      window.widget = ProfitbaseWidget()
      window.widget.init({
        params: {
          host: "https://smart-catalog.profitbase.ru/eco",
          pbDomain: "profitbase.ru",
          accountId: "5754",
          referrer: "https://point-toksovo.ru",
          pbApiKey: "6c67c7b0378350d936bb8bb5ec185ea6"
        },
        button: {
          create: true
        }
      })
    }
    
    document.head.appendChild(script)
  }
})