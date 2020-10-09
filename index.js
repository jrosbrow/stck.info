addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return await response.json()
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

async function handleRequest(request) {
  var url = request.url.split("/");
  var ticker = url.slice(-1)[0];
  var yf_url = "https://query1.finance.yahoo.com/v8/finance/chart/";
  var ticker_url = yf_url.concat(ticker);

  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  }
  const response = await fetch(ticker_url, init)
  const results = await gatherResponse(response)

  const price = results.chart.result[0].meta.regularMarketPrice;
  const timestamp = results.chart.result[0].meta.regularMarketTime;

  var human_time = new Date();
  human_time.setTime(timestamp*1000);
  human_time_string = human_time.toUTCString();

  const output = ticker + " " + price + " " + human_time_string
  return new Response(output, {
    headers: { 'content-type': 'text/plain'},
  })
}
