document.addEventListener('DOMContentLoaded', () => {
    const latestInfoContainer = document.getElementById('latest-info-container');

    // 運営用ページから追加される情報（ダミーデータ）をシミュレート
    // 実際には、API経由で情報を取得したり、WebSocketでリアルタイムに受け取ったりします。
    const initialInfo = [
        {
            type: 'earthquake',
            date: '2025/07/06 22:30',
            text: '【速報】兵庫県南部で震度4の地震が発生しました。津波の心配はありません。落ち着いて行動してください。'
        },
        {
            type: 'weather',
            date: '2025/07/06 22:00',
            text: '【警報】大阪府に大雨警報が発表されました。河川の増水、土砂災害に警戒してください。'
        },
        {
            type: 'traffic',
            date: '2025/07/06 21:45',
            text: '【JR情報】JR神戸線は、三ノ宮駅での人身事故の影響で現在、一部区間で運転を見合わせています。'
        },
        {
            type: 'earthquake',
            date: '2025/07/06 20:15',
            text: '【M5.0】〇〇県沖でM5.0の地震がありました。各地の震度情報をご確認ください。'
        },
        {
            type: 'weather',
            date: '2025/07/06 19:30',
            text: '【注意報】京都府に雷注意報が発表されています。急な雷雨にご注意ください。'
        }
    ];

    /**
     * 最新情報セクションに新しい情報を追加する関数
     * @param {string} type - 情報の種類 ('earthquake', 'weather', 'traffic', 'system'など)
     * @param {string} date - 情報の日付と時刻 (例: '2025/07/06 22:30')
     * @param {string} text - 情報の内容
     */
    function addLatestInfo(type, date, text) {
        // 読み込みメッセージがあれば削除
        const loadingMessage = latestInfoContainer.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        const infoItem = document.createElement('div');
        infoItem.classList.add('info-item', type); // 情報の種類でCSSクラスを付与

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
            default:
                tagText = '情報';
        }

        infoItem.innerHTML = `
            <span class="info-tag">${tagText}</span>
            <span class="info-date">${date}</span>
            <p>${text}</p>
        `;
        
        // 新しい情報をリストの先頭に追加 (最新の情報が上に来るように)
        latestInfoContainer.prepend(infoItem);
    }

    // ページロード時にダミー情報を表示
    initialInfo.forEach(info => {
        addLatestInfo(info.type, info.date, info.text);
    });

    // --- ここから運営用ページからの追加をシミュレートする例 ---
    // 実際には、この部分は運営用ページから呼び出されるAPIなどになる
    // 例: 5秒後に新しい情報を追加
    setTimeout(() => {
        addLatestInfo(
            'traffic',
            '2025/07/06 23:05',
            '【運行再開】JR神戸線は運転を再開しました。引き続き遅延が発生する可能性があります。'
        );
    }, 5000);

    setTimeout(() => {
        addLatestInfo(
            'earthquake',
            '2025/07/06 23:10',
            '【更新】先ほどの地震は震度3に修正されました。'
        );
    }, 10000);
    // -------------------------------------------------------------
});
