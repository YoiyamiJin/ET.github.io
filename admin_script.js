document.addEventListener('DOMContentLoaded', () => {
    // --- ★ここをあなたのGoogle Apps ScriptのウェブアプリURLに変更してください★ ---
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymYXd08bv_RVcPYGutYflXnmIzsBcJES66nsF3oDh74uMBePk3kgZCaevE3xzl6DrwoQ/exec";
    // ----------------------------------------------------------------------

    const infoIdInput = document.getElementById('info-id');
    const infoTypeSelect = document.getElementById('info-type'); // Type選択要素を再定義
    const infoTitleInput = document.getElementById('info-title');
    const infoContentInput = document.getElementById('info-content'); // Content入力要素を再定義

    const addButton = document.getElementById('add-button');
    const updateButton = document.getElementById('update-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const infoListContainer = document.getElementById('info-list-container');

    // 初期表示でデータを読み込む
    fetchInfo();

    // 追加ボタンのイベントリスナー
    addButton.addEventListener('click', async () => {
        const type = infoTypeSelect.value;   // Typeを取得
        const title = infoTitleInput.value.trim();
        const content = infoContentInput.value.trim(); // Contentを取得
        if (!title || !content) {
            alert('タイトルと内容を入力してください。');
            return;
        }

        const now = new Date();
        const dateString = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const data = {
            Type: type,      // Typeも送信
            Title: title,
            Content: content,
            Date: dateString
        };

        const response = await sendRequest('add', data);
        if (response.success) {
            alert('情報が追加されました！');
            clearForm();
            fetchInfo(); // リストを更新
        } else {
            alert('情報の追加に失敗しました: ' + response.error);
        }
    });

    // 更新ボタンのイベントリスナー
    updateButton.addEventListener('click', async () => {
        const id = infoIdInput.value;
        const type = infoTypeSelect.value;   // Typeを取得
        const title = infoTitleInput.value.trim();
        const content = infoContentInput.value.trim(); // Contentを取得
        if (!id || !title || !content) {
            alert('タイトル、内容、またはIDが不正です。');
            return;
        }

        const now = new Date();
        const dateString = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const data = {
            ID: parseInt(id),
            Type: type,      // Typeも送信
            Title: title,
            Content: content,
            Date: dateString
        };

        const response = await sendRequest('edit', data);
        if (response.success) {
            alert('情報が更新されました！');
            clearForm();
            fetchInfo(); // リストを更新
            toggleEditMode(false);
        } else {
            alert('情報の更新に失敗しました: ' + response.error);
        }
    });

    // キャンセルボタンのイベントリスナー
    cancelEditButton.addEventListener('click', () => {
        clearForm();
        toggleEditMode(false);
    });

    /**
     * Google Apps Scriptにリクエストを送信するヘルパー関数
     */
    async function sendRequest(action, data = null) {
        let url = `${GAS_WEB_APP_URL}?action=${action}`;
        const options = {
            method: action === 'read' ? 'GET' : 'POST',
            headers: {
                'Content-Type': 'text/plain'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GASリクエストエラー:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * スプレッドシートから情報を取得してリストに表示する
     */
    async function fetchInfo() {
        infoListContainer.innerHTML = '<p class="loading-message">情報を読み込み中...</p>'; // ローディング表示
        const response = await sendRequest('read');

        if (response.success && response.data) {
            infoListContainer.innerHTML = ''; // クリア
            if (response.data.length === 0) {
                infoListContainer.innerHTML = '<p class="loading-message">登録されている情報はありません。</p>';
                return;
            }

            response.data.forEach(item => {
                const infoItem = document.createElement('div');
                infoItem.classList.add('info-item');
                infoItem.setAttribute('data-id', item.ID);

                infoItem.innerHTML = `
                    <div class="info-item-content">
                        <h3>${item.Title}</h3>
                        <div class="info-item-meta">
                            <span class="item-type">${getDisplayType(item.Type)}</span> | <span>${item.Date}</span> | ID: ${item.ID}
                        </div>
                        <p>${item.Content}</p>
                    </div>
                    <div class="info-item-actions">
                        <button class="edit-btn">編集</button>
                        <button class="delete-btn">削除</button>
                    </div>
                `;
                infoListContainer.appendChild(infoItem);
            });
            addEditDeleteListeners(); // 編集・削除ボタンのイベントリスナーを設定
        } else {
            infoListContainer.innerHTML = '<p class="loading-message">情報の読み込みに失敗しました。</p>';
            console.error('情報の読み込みエラー:', response.error);
        }
    }

    /**
     * 編集・削除ボタンにイベントリスナーを追加する
     */
    function addEditDeleteListeners() {
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.info-item');
                const id = itemElement.dataset.id;
                const title = itemElement.querySelector('h3').textContent;
                const content = itemElement.querySelector('p').textContent;
                const typeCode = getTypeFromDisplay(itemElement.querySelector('.item-type').textContent); // Typeを文字列からコードに変換

                // フォームにデータをセット
                infoIdInput.value = id;
                infoTypeSelect.value = typeCode; // Typeもセット
                infoTitleInput.value = title;
                infoContentInput.value = content;

                toggleEditMode(true);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const itemElement = e.target.closest('.info-item');
                const id = itemElement.dataset.id;
                if (confirm(`ID: ${id} の情報を本当に削除しますか？`)) {
                    const response = await sendRequest('delete', { id: parseInt(id) });
                    if (response.success) {
                        alert('情報が削除されました！');
                        fetchInfo(); // リストを更新
                    } else {
                        alert('情報の削除に失敗しました: ' + response.error);
                    }
                }
            });
        });
    }

    /**
     * フォームをクリアする
     */
    function clearForm() {
        infoIdInput.value = '';
        infoTypeSelect.value = 'earthquake'; // デフォルト値に戻す
        infoTitleInput.value = '';
        infoContentInput.value = '';
    }

    /**
     * 編集モードの表示を切り替える
     */
    function toggleEditMode(isEditMode) {
        if (isEditMode) {
            addButton.style.display = 'none';
            updateButton.style.display = 'inline-block';
            cancelEditButton.style.display = 'inline-block';
        } else {
            addButton.style.display = 'inline-block';
            updateButton.style.display = 'none';
            cancelEditButton.style.display = 'none';
        }
    }

    /**
     * タイプコード（例: earthquake）から表示名（例: 地震速報）を取得
     */
    function getDisplayType(typeCode) {
        switch (typeCode) {
            case 'earthquake': return '地震速報';
            case 'weather': return '気象情報';
            case 'traffic': return '交通情報';
            case 'system': return 'システム通知';
            default: return typeCode; // 不明な場合はそのまま表示
        }
    }

    /**
     * 表示名（例: 地震速報）からタイプコード（例: earthquake）を取得
     */
    function getTypeFromDisplay(displayType) {
        switch (displayType) {
            case '地震速報': return 'earthquake';
            case '気象情報': return 'weather';
            case '交通情報': return 'traffic';
            case 'システム通知': return 'system';
            default: return 'system'; // 不明な場合はデフォルト
        }
    }
});
