// HTMLドキュメントが完全に読み込まれてからJavaScriptコードを実行します
document.addEventListener('DOMContentLoaded', () => {
    // 各HTML要素をIDを使って取得します
    const messageInput = document.getElementById('message-input'); // メッセージ入力欄
    const sendButton = document.getElementById('send-button');     // 送信ボタン
    const chatMessages = document.getElementById('chat-messages'); // メッセージ表示エリア

    /**
     * メッセージをチャット表示エリアに追加する関数
     * @param {string} message - 表示するメッセージのテキスト
     * @param {boolean} isSentByUser - メッセージがユーザー自身によって送信されたものか (true: 自分, false: 相手)
     */
    function addMessage(message, isSentByUser = false) {
        // 新しいdiv要素を作成し、メッセージのコンテナとします
        const messageElement = document.createElement('div');
        // 'message' クラスを追加して、基本のメッセージスタイルを適用します
        messageElement.classList.add('message');

        // もしユーザーが送信したメッセージであれば、'sent' クラスも追加します
        // これにより、CSSで送信メッセージを右寄せ・色変更できます
        if (isSentByUser) {
            messageElement.classList.add('sent');
        }

        // メッセージのテキスト内容を設定します
        messageElement.textContent = message;
        // 作成したメッセージ要素をチャットメッセージエリアの末尾に追加します
        chatMessages.appendChild(messageElement);

        // 新しいメッセージが追加されたら、一番下までスクロールします
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 送信ボタンがクリックされた時のイベントリスナー
    sendButton.addEventListener('click', () => {
        // 入力欄からメッセージのテキストを取得し、前後の空白を取り除きます
        const message = messageInput.value.trim();

        // メッセージが空でなければ（何か入力されていれば）
        if (message) {
            // ユーザーが送信したメッセージとして追加します
            addMessage(message, true);
            // メッセージ送信後、入力欄を空にします
            messageInput.value = '';

            // --- ここからデモンストレーション用の簡易的な返信機能 ---
            // 実際にはサーバーからの返信を待ちます
            setTimeout(() => {
                addMessage("こんにちは！メッセージありがとうございます！");
            }, 1000); // 1秒後に返信をシミュレート
            // --------------------------------------------------------
        }
    });

    // メッセージ入力欄でEnterキーが押された時のイベントリスナー
    messageInput.addEventListener('keypress', (e) => {
        // 押されたキーが 'Enter' であれば
        if (e.key === 'Enter') {
            // 送信ボタンがクリックされた時と同じ処理を実行します
            sendButton.click();
        }
    });

    // ページロード時に最初のウェルカムメッセージを表示（オプション）
    addMessage("オープンチャットへようこそ！メッセージをどうぞ！");
});
