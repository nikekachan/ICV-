# たんごちょう

健太・かつにいのための単語帳＆出題アプリです。フロントエンドは React（Netlifyで公開）、データの保存・読み込みは Google Apps Script（GAS）をサーバーとして使い、Googleスプレッドシートに保存します。

## 機能

1. **ユーザー選択画面（トップページ）**
   - 「健太」「かつにい」の2つの選択肢を表示し、それぞれ専用の単語帳ページへ遷移します。
2. **単語帳ページ（個人ごと）**
   - 登録した単語・例文の一覧を表示します。
   - 「単語/文」+「意味」の新規登録フォームがあります。
   - 一覧から編集・削除ができます。
3. **出題モード**
   - 出題元を「健太の単語帳」「かつにいの単語帳」から選択できます。
   - 出題形式（単語→意味 / 意味→単語 / ランダム）を選べます。
   - 3択クイズ形式で、正解・不正解のアニメーション演出があります。

データはGAS経由でスプレッドシートに保存されるので、どの端末からアクセスしても同じ単語帳が見えます。

## 公開手順（① GASをサーバーとして作る → ② Netlifyでフロントを公開する）

### ① Google Apps Script（サーバー）をデプロイする

1. [Googleスプレッドシート](https://sheets.new) を新規作成します（単語帳専用のシートにしてください。名前は何でもOK）。
2. メニューの「拡張機能」→「Apps Script」を開きます。
3. エディタに最初から入っているコードを全部削除し、このリポジトリの `gas/Code.gs` の中身を丸ごと貼り付けます。
4. 右上の「デプロイ」→「新しいデプロイ」をクリックします。
5. 歯車アイコンから種類を選択し、「ウェブアプリ」を選びます。
6. 設定は以下にします。
   - 実行するユーザー: **自分**
   - アクセスできるユーザー: **全員**
7. 「デプロイ」をクリックし、求められたらGoogleアカウントで権限を承認します。
8. 発行された **ウェブアプリのURL**（`https://script.google.com/macros/s/.../exec` の形式）をコピーしておきます。これが `VITE_GAS_URL` になります。

> コードを更新したときは、「新しいデプロイ」ではなく既存デプロイの「編集」→「バージョン: 新バージョン」→「デプロイ」で更新すると、URLを変えずに反映できます。

### ② Netlifyでフロントエンドを公開する

1. このリポジトリ（`nikekachan/ICV-`、ブランチ `claude/user-vocabulary-app-lmwnq0`）をご自身のNetlifyアカウントに接続します。
   - Netlifyのダッシュボードで **Add new site → Import an existing project** を選び、GitHubからこのリポジトリを選択してください。
2. ビルド設定（`netlify.toml` に書いてあるので自動検出されますが、確認用です）
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Branch to deploy: `claude/user-vocabulary-app-lmwnq0`
3. **Site settings → Environment variables** で、①で控えたURLを環境変数として追加します。
   - Key: `VITE_GAS_URL`
   - Value: `https://script.google.com/macros/s/.../exec`
4. 「Deploy site」を実行すると、公開URL（`https://○○○.netlify.app`）が発行されます。

これで、発行されたURLをスマホ・ PCどちらで開いても、同じGASスプレッドシートのデータを見られるようになります。

## ローカルで試す場合

```bash
npm install
cp .env.example .env
# .env の VITE_GAS_URL に①で取得したURLを設定
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` に静的ファイルが出力されます（Netlifyはこれを自動実行します）。

## 技術スタック

- React 18 + Vite（フロントエンド、Netlifyで公開）
- react-router-dom（HashRouter）
- Framer Motion（アニメーション）
- Google Apps Script + Googleスプレッドシート（サーバー・データ保存）
