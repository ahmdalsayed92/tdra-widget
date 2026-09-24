(async function () {
  console.log("Checker script loaded");
  const appUrl = "http://localhost:58386/"; // Angular app URL
  const scriptTag = document.currentScript;
  const urlParams = new URLSearchParams(scriptTag.src.split("?")[1]);
  const apiKey = urlParams.get("key");
  const adminEmail = "ahmdalsayed92@gmail.com";

  if (!apiKey) {
    console.error("API key is missing.");
    return;
  }
  verifyAdmin();
  function getAdminDataByDomain() {
    const url = `/entities/${appUrl}/pages`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Sample expected response:
        // { "adminEmail": "admin@example.com", "isActive": true }
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  function verifyAdmin() {
    const url = "http://localhost:3000/api/entities/validate";

    const data = {
      domain: window.location.host,
      apiKey: apiKey,
      adminEmail: adminEmail,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Success:", result);
        addingCheckerBtnStyleTag();
        drawCheckerBtn();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function openWidget() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const iframe = document.createElement("iframe");
    iframe.src = appUrl; // Angular app URL
    iframe.id = "iframeApp";

    document.body.appendChild(iframe);
    document.body.appendChild(overlay);
    iframe.onload = function () {
      const iframeWindow = iframe.contentWindow;
      iframeWindow.postMessage(
        { message: "domain", domain: window.location.href },
        appUrl
      );
    };
  }

  async function axeScanner() {
    return new Promise((resolve, reject) => {
      // Load axe-core
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.6.1/axe.min.js";
      script.onload = async () => {
        try {
          // Run axe-core
          const results = await axe.run();
          console.log("Results from axe: ", results);

          // Calculate accessibility score
          const totalRulesChecked =
            results.passes.length +
            results.violations.length +
            results.inapplicable.length;
          const rulesWithIssues = results.violations.length;
          const scorePercentage =
            totalRulesChecked === 0
              ? 100
              : ((totalRulesChecked - rulesWithIssues) / totalRulesChecked) *
                100;

          resolve(results);
        } catch (error) {
          reject(error);
        }
      };
      document.head.appendChild(script);
    });
  }

  // Listen for messages from Angular app
  window.addEventListener("message", async (event) => {
    if (event.data.message === "start the scan!") {
      console.log("Starting accessibility scan...");
      try {
        const results = await axeScanner();
        const currentPageUrl = window.location.href;

        const iframeApp = document.getElementById("iframeApp");
        iframeApp.contentWindow.postMessage(
          { message: "results", results, currentPageUrl },
          appUrl
        );
      } catch (error) {
        console.error("Error in accessibility scan:", error);
      }
    }
    if (event.data.message === "close the widget!") {
      const overlay = document.querySelector(".overlay");
      const iframe = document.getElementById("iframeApp");
      overlay?.remove();
      iframe?.remove();
    }
  });

  function drawCheckerBtn() {
    // Create the sticky "Checker" button
    const checkerButton = document.createElement("button");
    iconSVG = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.2358 19.8845C24.1148 20.0788 23.8189 20.5457 23.675 20.6905C23.3733 20.9956 22.9527 20.9749 22.6731 20.9608C22.6192 20.9586 22.5454 20.9549 22.5174 20.9572C21.9839 20.9978 21.3243 21.3103 21.0963 21.8266C20.9834 22.0808 20.9606 22.3556 20.934 22.674C20.9185 22.8601 20.9023 23.0522 20.8676 23.2598L20.8329 23.4652L20.6817 23.6085C20.1032 24.1596 19.4015 24.5304 18.7891 24.8355C17.0958 25.6769 15.2748 26.0936 13.4487 26.0936C11.0729 26.0936 8.68822 25.3888 6.56179 23.9978C2.73983 21.4979 0.583893 17.3647 0.794912 12.9419C0.927722 10.1532 1.88911 7.58459 3.57358 5.51391C5.14073 3.58877 7.24798 2.17114 9.66806 1.4132C12.0771 0.65969 14.5997 0.622014 16.963 1.30608C19.5092 2.04334 21.7508 3.60281 23.4448 5.81753C26.5415 9.86432 26.8661 15.6486 24.2358 19.8845ZM20.9214 2.2753C18.6357 0.769022 16.0481 0 13.4325 0C11.8218 0 10.2015 0.291061 8.63288 0.88131C4.61318 2.39276 1.65227 5.63285 0.508634 9.76976C-0.765599 14.3809 0.38763 19.1798 3.59424 22.606C6.83627 26.0714 11.5975 27.5518 16.3277 26.5686C18.0506 26.2103 19.7461 25.4427 21.024 24.4492C21.1 23.6919 21.356 22.2108 22.5454 21.5422C23.163 21.1958 23.8322 21.1012 24.4402 21.0783C26.4316 18.3243 27.2299 14.7496 26.6315 11.2214C26.0014 7.51293 23.9207 4.25289 20.9214 2.2753Z"
          fill="white"/>
    <path d="M25.3742 23.8203C24.4984 23.8203 23.7864 24.5332 23.7864 25.4101C23.7864 26.2869 24.4984 26.9998 25.3742 26.9998C26.25 26.9998 26.962 26.2869 26.962 25.4101C26.962 24.5332 26.25 23.8203 25.3742 23.8203Z"
          fill="white"/>
    <path d="M20.9245 15.8536C20.8706 16.0124 20.501 16.9484 20.1557 17.2749C19.8878 17.529 19.5042 17.5446 19.1965 17.5571C19.1397 17.5593 19.0548 17.5623 19.0268 17.5667C17.9806 17.7344 17.6685 18.092 17.5083 19.3064C17.5083 19.3219 17.5106 19.3448 17.5113 19.3685C17.5201 19.5317 17.5379 19.8716 17.2752 20.1656C17.2213 20.2262 17.1217 20.3384 16.575 20.6251C15.6726 21.0986 14.6101 21.3291 13.5152 21.3291C11.8632 21.3291 10.1389 20.8053 8.78645 19.8043C6.76996 18.3128 5.59164 16.0338 5.55328 13.5517C5.51491 11.0836 6.61501 8.78317 8.57027 7.24069C11.512 4.92032 15.6999 5.00971 18.5288 7.4527C20.9518 9.5448 21.9147 12.9208 20.9245 15.8536ZM13.5396 4.73047C12.7737 4.73047 11.9945 4.83168 11.2161 5.03778C8.00435 5.89028 5.65805 8.30816 4.9394 11.5069C4.25838 14.5431 5.19838 17.6302 7.45614 19.7667C9.7139 21.9031 12.8482 22.6692 15.8386 21.8167C16.3846 21.6615 17.2988 21.267 17.6271 21.0233C17.6412 20.9479 17.6507 20.8179 17.6559 20.7337C17.6648 20.6125 17.6729 20.4862 17.6958 20.3665C18.0034 18.7612 18.8254 17.9398 20.3623 17.7019L20.4228 17.6953L20.9931 17.6635C22.7956 14.5638 22.3227 10.268 19.8384 7.53766C18.1753 5.71003 15.9242 4.73047 13.5396 4.73047Z"
          fill="white"/>
    <path d="M16.4289 13.8052L15.9825 13.9219C15.8401 13.9588 15.7088 13.9758 15.5922 13.9906C15.514 14.0009 15.4395 14.0098 15.3767 14.0246C14.5459 14.2159 14.1128 14.6791 13.9741 15.5264C13.9734 15.5427 13.9734 15.5619 13.9734 15.5818C13.9719 15.7902 13.9704 16.1381 13.6613 16.3523L13.5152 16.4535L13.3381 16.4624C13.2946 16.4646 13.2511 16.4654 13.2075 16.4654C12.2668 16.4654 11.3246 15.9497 10.7771 15.1253C9.82383 13.6899 10.3115 12.1349 11.2176 11.2299C12.1281 10.3206 13.6901 9.833 15.1259 10.7934C15.905 11.3149 16.4857 12.4348 16.4481 13.3435L16.4289 13.8052ZM15.9626 10.3819C15.7951 10.24 15.6579 10.1337 15.6121 10.1049C14.9444 9.67712 14.1992 9.46289 13.4525 9.46289C12.7914 9.46289 12.1288 9.63058 11.5157 9.96966C10.2156 10.687 9.44458 12.0049 9.4527 13.4934C9.4586 14.603 9.99648 15.7237 10.8907 16.4912C11.7304 17.2122 12.7464 17.5262 13.755 17.3755C13.8273 17.3644 14.0022 17.3208 14.1423 17.278C14.1446 17.2484 14.1468 17.2203 14.149 17.1967C14.1608 17.0519 14.1726 16.9019 14.2029 16.7675C14.5253 15.3078 15.4461 14.4198 16.8649 14.2004C16.9328 14.1901 17.028 14.1819 17.1918 14.1694C17.2125 14.1679 17.2361 14.1657 17.2612 14.1635C17.5556 12.7709 17.0678 11.3208 15.9626 10.3819Z"
          fill="white"/>
</svg>
`;
    const icon = document.createElement("svg");
    const btnText = document.createElement("span");
    icon.innerHTML = iconSVG;
    btnText.innerText = "Scan For Accessibility";

    checkerButton.appendChild(icon);
    checkerButton.appendChild(btnText);
    checkerButton.classList.add("checker-btn");

    document.body.appendChild(checkerButton);

    checkerButton.onclick = function () {
      openWidget();
    };
  }

  function addingCheckerBtnStyleTag() {
    // adding styles for the checker btn
    const style = document.createElement("style");
    style.innerText = `
    .checker-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 266px;
      height: 52px;
      border-radius: 8px;
      padding: 12px 24px;
      color: #fff;
      background-color: #92722A;
      border: none;
      font-size: 18px;
      cursor: pointer;
      transition: all .4s;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .checker-btn:hover {
      background-color:rgb(116, 88, 24);
    }
    iframe {
      position: fixed;
      width: 90%;
      height: 90vh;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ffffff;
      z-index: 99999999;
      border: 1px solid #B68A35;
      outline: none;
      border-radius: 12px;
    }
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0px;
      left: 0px;
      right: 0px;
      background-color: #000000bf;
      z-index: 99999;
    }
  `;

    document.head.appendChild(style);
  }
})();
