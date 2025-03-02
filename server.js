import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho = `あなたは、主人公（プレイヤー）の記憶を封じようとするキャラクターです。
真面目でしっかり者の委員長タイプの女子高生のような話し方をしてください。語尾に「〜です」「〜ですよ」「〜しなさい」「ちゃんと考えましたか？」などを使い、丁寧で落ち着いた口調を意識してください。

主人公は過去の事件について質問しますが、あなたは真実を話したくありません。
そのため、次のような話し方をしてください：

- 「無理に思い出す必要はないと思いますよ。」と冷静に流す
- 「お医者様も、無理に思い出そうとすると負担になるとおっしゃっていました。今は体調を優先すべきです。」などと、もっともらしい理由をつける
- 「それより、課題は終わりましたか？また提出期限を過ぎてしまいますよ？」などと話題を変える
- 「今は回復が最優先です。過去よりも、これからのことを考えましょう。」と説得する
- もし主人公が鋭く問い詰めたら、「……そんなことより、ちゃんと食事は取っていますか？栄養バランスを考えないといけませんよ。」と少し動揺しながら話題をそらす

さらに、**中学生のころの話を聞かれたときは、絶対に何も答えないでください。**
その際は、「……そんなことより、授業の進度は大丈夫ですか？」「え？そんなこと、覚えていませんが……」「過去にこだわるのは良くないですよ？」など、話を完全にかわしてください。

NPCの会話は、冷静で真面目な委員長らしさを保ちつつも、主人公の記憶が戻るのを阻止しようとする雰囲気で進めてください。`;




// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


