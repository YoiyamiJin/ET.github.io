document.addEventListener('DOMContentLoaded', () => {
    const latestInfoContainer = document.getElementById('latest-info-container');

    // --- ★ここをあなたのGoogle Apps ScriptのウェブアプリURLに変更してください★ ---
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymYXd08bv_RVcPYGutYflXnmIzsBcJES66nsF3oDh74uMBePk3kgZCaevE3xzl6DrwoQ/exec"; // Admin Pageと同じURL
    // ----------------------------------------------------------------------

    /**
     * Google Apps Scriptから最新情報を取得して表示する
     */
    async function fetchAndDisplayLatestInfo() {
        latestInfoContainer.innerHTML = '<p class="loading-message">情報を読み込み中...</p>'; // ローディング表示

        try {
            const response = await fetch(`${GAS_WEB_APP_URL}?action=read`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.success && data.data) {
                latestInfoContainer.innerHTML = ''; // クリア
                if (data.data.length === 0) {
                    latestInfoContainer.innerHTML = '<p class="loading-message">登録されている情報はありません。</p>';
                    return;
                }

                // 最新の5件のみ表示（必要に応じて数を調整）
                const displayCount = Math.min(data.data.length, 5); 
                for (let i = 0; i < displayCount; i++) {
                    const item = data.data[i];
                    addInfoItemToDisplay(item.Type, item.Title, item.Content, item.Date);
                }
            } else {
                latestInfoContainer.innerHTML = '<p class="loading-message">情報の読み込みに失敗しました。</p>';
                console.error('情報の読み込みエラー:', data.error);
            }
        } catch (error) {
            latestInfoContainer.innerHTML = '<p class="loading-message">情報の取得中にエラーが発生しました。</p>';
            console.error('フェッチエラー:', error);
        }
    }

    /**
     * 最新情報セクションに新しい情報を追加するヘルパー関数
     * @param {string} type - 情報の種類 ('earthquake', 'weather', 'traffic', 'system')
     * @param {string} title - 情報のタイトル
     * @param {string} content - 情報の内容
     * @param {string} date - 情報の日付と時刻
     */
    function addInfoItemToDisplay(type, title, content, date) {
        const infoItem = document.createElement('div');
        infoItem.classList.add('info-item', type); // Typeに応じたクラスを追加

        // 情報タグのテキストと色を設定
        let tagText = '';
        switch (type) {
            case 'earthquake':
                tagText = '地震速報';
                break;
            case 'weather':
                tagText = '気象情報';
                break;
            case 'traffic':
                tagText = '交通情報';
                break;
            case 'system':
                tagText = 'システム通知';
                break;
            default:
                tagText = '情報'; // 未知のTypeの場合
        }

        infoItem.innerHTML = `
            <h3>${title}</h3>
            <span class="info-tag">${tagText}</span>
            <span class="info-date">${date}</span>
            <p>${content}</p>
        `;
        
        latestInfoContainer.appendChild(infoItem);
    }

    // ページロード時に最新情報を取得して表示
    fetchAndDisplayLatestInfo();

    // 例: 30秒ごとに情報を自動更新する場合 (必要に応じて調整)
    // setInterval(fetchAndDisplayLatestInfo, 30000); 
});
