# たんごちょう

健太・かつにいのための単語帳＆出題アプリです。フロントエンドは React（GitHub Pagesで公開）、データの保存・読み込みは Google Apps Script（GAS）をサーバーとして使い、Googleスプレッドシートに保存します。

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

## 公開手順（① GASをサーバーとして作る → ② GitHub Pagesでフロントを公開する）

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

### ② GitHub Pagesでフロントエンドを公開する

このリポジトリには `.github/workflows/deploy-pages.yml` が入っていて、`main` ブランチにpushするたびに自動でビルド＆公開されます。あなたがやることは次の2つだけです。

1. **リポジトリに `VITE_GAS_URL` を設定する**
   - GitHubのリポジトリページで **Settings → Secrets and variables → Actions → Variables タブ → New repository variable**
   - Name: `VITE_GAS_URL`
   - Value: ①で取得したウェブアプリのURL（`https://script.google.com/macros/s/.../exec`）
   - 「Add variable」で保存します。
2. **GitHub Pagesを有効化する（初回のみ）**
   - **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にします。
   - すでにActionsがPagesを設定済みの場合は、この手順は不要です。

設定後、`main` ブランチに何かをpushする（またはActionsタブからワークフローを手動実行する）と、数十秒でビルドが走り、
`https://nikekachan.github.io/ICV-/` で公開されます（公開URLは **Settings → Pages** にも表示されます）。

`VITE_GAS_URL` を後から設定・変更した場合も、Actionsタブから `Deploy to GitHub Pages` ワークフローを **Re-run** すれば反映されます。

これで、発行されたURLをスマホ・ PCどちらで開いても、同じGASスプレッドシートのデータを見られるようになります。

> Netlifyで公開したい場合は、`netlify.toml` も用意してあるので、Netlifyのダッシュボードから `nikekachan/ICV-` をインポートし、環境変数 `VITE_GAS_URL` を設定するだけで同様に公開できます。

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

`dist/` に静的ファイルが出力されます（GitHub Actionsのワークフローはこれを自動実行します）。

## 技術スタック

- React 18 + Vite（フロントエンド、GitHub Pagesで公開）
- react-router-dom（HashRouter）
- Framer Motion（アニメーション）
- Google Apps Script + Googleスプレッドシート（サーバー・データ保存）
