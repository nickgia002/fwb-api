USE [test_db]
GO

/****** Object:  View [dbo].[ViewShukaGembaHanyuPublication]    Script Date: 2024/03/27 9:05:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER VIEW [dbo].[ViewShukaGembaHanyuPublication]
AS
SELECT
      TblKoteiHeader.HeaderId       AS HeaderId
    , TblKoteiDetail.DetailId       AS KoteiDetailId
    , TblShukaGembaHanyu.ShukaGembaHanyuId

    , TblKoteiDetail.Nendo                                                  -- 年度
    , TblKoteiDetail.StatusId                                               -- 状態ID

    , TblKoteiDetail.KoujiNo                                                -- 工事番号
    , TblKoteiDetail.BukenNo                                                -- 物件番号
    , TblKoteiHeader.GembaName                                              -- 現場名称
    , TblKoteiDetail.Goutou                                                 -- 号棟
    , TblKoteiHeader.Tousu                                                  -- 棟数
    , TblKoteiDetail.Kouzo                                                  -- 構造
		-----------------------------------  2023.12.21 ADD T-Ushinmei PCSUP-3561 一建設外注先　自動メールについて
	, dbo.TblBukenBasic.NobeyukaMenseki1
	----------------------------------- 
    ----------------------------------- 2022.12.26 Add D.Suzuki シ-22158 中継地用の自動配信メールに【坪数】の追加
    , dbo.TblBukenBasic.NobeyukaMenseki2                                    -- 坪数
    -----------------------------------
    , TblKoteiDetail.BukenKbnId                                             -- 物件区分ID
    , TblKoteiDetail.ShukaJotoDate                                          -- 出荷上棟日

    -- ■ビルダー
    , TblKoteiHeader.TorihikiId                                             -- 取引先ID
    , MstTorihiki.TorihikiName                                              -- 取引先(ビルダー)

    -- ■工事店
    , MstKojiten.TempoId                AS KojitenId                        -- 工事店ID
    , MstKojiten.TempoName              AS KoujitenName                     -- 工事店 
    , dbo.GetCodeCatName (MstKojiten.TempoCd, MstKojiten.TempoName) AS KojitenCdAndName             -- 工事店CD&Name
    , MstKojiten.MailAddress            AS KojitenMailAddress               -- 工事店メールアドレス

    -- ■監督
    , MstKantoku.KantokuId                                                  -- 監督ID
    , MstKantoku.KantokuSei + MstKantoku.KantokuMei AS KantokuName          -- 監督名
    , MstKantoku.Telephone              AS KantokuTel                       -- 監督電話番号
    , MstKantoku.MailAddress            AS KantokuMailAddress               -- 監督メールアドレス

    -- ■中継
    , ISNULL (KanryoChukei.HaisoChukeiId, YoteiChukei.HaisoChukeiId)        AS ChukeiId             -- 中継ID
    , ISNULL (KanryoChukei.HaisoChukeiName, YoteiChukei.HaisoChukeiName)    AS ChukeiName           -- 中継先
    , ISNULL (KanryoChukei.MailAddress, YoteiChukei.MailAddress)            AS ChukeiMailAddress    -- 中継メールアドレス

    -- ■外注先
    -- 構造
    , MstKozoKojo.KojoId                AS KozoKojoId                       -- 構造加工場ID
    , MstKozoKojo.KojoNameRyaku         AS KozoKojoNameRyaku                -- 構造加工場略称
    , MstKozoKojo.MailAddress           AS KozoKojoMailAddress              -- 構造加工場メールアドレス
    , MstKozoKojo.IsJisha               AS KozoKojoIsJisha                  -- 構造加工場　自社区分
    , ISNULL(TblShukaYotei.KouzoShukaDate1, TblShukaYotei.KouzoShukaDate2)      AS KouzoShukaDate   -- 構造出荷発日
    , ISNULL(TblShukaYotei.KouzoChukeiDate1, TblShukaYotei.KouzoChukeiDate2)    AS KouzoChukeiDate  -- 構造中継着日
    -- 羽柄
    , MstHagaraKojo.KojoId              AS HagaraKojoId                     -- 羽柄加工場ID
    , MstHagaraKojo.KojoNameRyaku       AS HagaraKojoNameRyaku              -- 羽柄加工場略称
    , MstHagaraKojo.MailAddress         AS HagaraKojoMailAddress            -- 羽柄加工場メールアドレス
    , MstHagaraKojo.IsJisha             AS HagaraKojoIsJisha                -- 羽柄加工場　自社区分
    , TblShukaYotei.HagaraShukaDate                                         -- 羽柄出荷発日
    , TblShukaYotei.HagaraChukeiDate                                        -- 羽柄出荷着日
    -- IDS合板
    , MstIDSGohanKojo.KojoId            AS IDSGohanKojoId                   -- IDS合板工場ID
    , MstIDSGohanKojo.KojoNameRyaku     AS IDSGohanKojoNameRyaku            -- IDS合板工場略称
    , MstIDSGohanKojo.MailAddress       AS IDSGohanKojoMailAddress          -- IDS合板工場メールアドレス
    , MstIDSGohanKojo.IsJisha           AS IDSGohanKojoIsJisha              -- IDS合板工場　自社区分
    -- LVL野縁
    , MstLVLNobuchiKojo.KojoId          AS LVLNobuchiKojoId                 -- LVL野縁工場ID
    , MstLVLNobuchiKojo.KojoNameRyaku   AS LVLNobuchiKojoNameRyaku          -- LVL野縁工場略称
    , MstLVLNobuchiKojo.MailAddress     AS LVLNobuchiKojoMailAddress        -- LVL野縁工場メールアドレス
    , MstLVLNobuchiKojo.IsJisha         AS LVLNobuchiKojoIsJisha            -- LVL野縁工場　自社区分
    -- ■素材外注
    , MstSozaiGaichu.KojoId             AS SozaiGaichuId                    -- 素材外注先ID
    , MstSozaiGaichu.KojoNameRyaku      AS SozaiGaichuNameRyaku             -- 素材外注先略称
    , MstSozaiGaichu.MailAddress        AS SozaiGaichuMailAddress           -- 素材外注先メールアドレス
    , TblShukaYotei.SozaiTumikomiDate                                       -- 素材出荷発日
    , TblShukaYotei.SozaiTumiorosiDate                                      -- 素材中継着日

    , TblYotei.SakuzuIraiDate                                               -- 作図依頼日(図面送信日)
    , TblYotei.KakoShoninHenkyakuDate                                       -- 加工承認書返却日
    , Nomono.MeisyoName                 AS NomonoName                       -- 野物
    , CASE WHEN TblShukaYotei.IsComplete = 1 THEN '完了' ELSE '予定' END AS IsCompleteName          --居場所
    , TblShukaGembaHanyu.HanyuSharyoId                                      -- 現場搬入車両ID
    , HanyuSharyo.MeisyoName            AS HanyuSharyoName                  -- 現場搬入車両
    , TblShukaGembaHanyu.JotoBinWreckerId                                   -- 上棟搬入日レッカーID
    , JotoBinWrecker.MeisyoName         AS JotoBinWreckerName               -- 上棟搬入日レッカー
    , dbo.TblKoteiDetail.KouzoDate1Yotei    AS KozoYotei                    -- 1F構造予定
    , CASE ISNULL(dbo.TblKoteiDetail.IsKakuteiKouzoDate1, 0) WHEN 1 THEN '○' ELSE '' END AS IsKakutei          -- 現場搬入予定日(1F構造)確定フラグ

    -- ■現場搬入情報
    , TblShukaGembaHanyu.GembaAnnaiId                                       -- 現場案内図ID
    , MstGenbaAnnai.MeisyoName          AS GembaAnnai                       -- 現場案内図
    , dbo.GetCodeCatName(MstGenbaAnnai.MeisyoCd, MstGenbaAnnai.MeisyoName)  AS GembaAnnaiCdAndName              -- 現場案内図CD&Name
    , TblShukaGembaHanyu.SharedLink                                         -- 共有リンク(現場案内図)
    , TblShukaGembaHanyu.SharedLink2                                        -- 共有リンク(指図書)
    , TblShukaGembaHanyu.SharedLink3                                        -- 共有リンク(その他)
    , TblShukaGembaHanyu.Biko                                               -- 備考(監督指示)
    , TblShukaGembaHanyu.LogiBiko                                           -- ロジ備考(メモ)
    , TblShukaGembaHanyu.HenkoRiyu                                          -- 変更理由
    --*** 1便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin1IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin1IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin1InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin1InitialPlanDate,TblShukaGembaHanyu.Bin1Date) AS Bin1HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin1Date                                           -- 搬入日
    , MM_Bin1Timed1.MeisyoName AS Bin1Hour                                  -- 搬入時間-時
    , MM_Bin1Timed2.MeisyoName AS Bin1Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin1Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin1Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin1Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin1Timed2.MeisyoName, '') 
      END AS Bin1Time                                                       -- 搬入時間
    , TblShukaGembaHanyu.Bin1HanyuButu                                      -- 搬入物
    --*** 2便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin2IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin2IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin2InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin2InitialPlanDate,TblShukaGembaHanyu.Bin2Date) AS Bin2HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin2Date                                           -- 搬入日
    , MM_Bin2Timed1.MeisyoName AS Bin2Hour                                  -- 搬入時間-時
    , MM_Bin2Timed2.MeisyoName AS Bin2Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin2Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin2Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin2Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin2Timed2.MeisyoName, '') 
      END AS Bin2Time                                                       -- 搬入時間
    , TblShukaGembaHanyu.Bin2HanyuButu                                      -- 搬入物
    --*** 3便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin3IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin3IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin3InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin3InitialPlanDate,TblShukaGembaHanyu.Bin3Date) AS Bin3HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin3Date                                           -- 搬入日
    , MM_Bin3Timed1.MeisyoName AS Bin3Hour                                  -- 搬入時間-時
    , MM_Bin3Timed2.MeisyoName AS Bin3Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin3Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin3Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin3Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin3Timed2.MeisyoName, '') 
      END AS Bin3Time                                                       -- 搬入時間
    , TblShukaGembaHanyu.Bin3HanyuButu                                      -- 搬入物
    --*** 4便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin4IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin4IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin4InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin4InitialPlanDate,TblShukaGembaHanyu.Bin4Date) AS Bin4HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin4Date                                           -- 搬入日
    , MM_Bin4Timed1.MeisyoName AS Bin4Hour                                  -- 搬入時間-時
    , MM_Bin4Timed2.MeisyoName AS Bin4Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin4Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin4Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin4Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin4Timed2.MeisyoName, '') 
       END AS Bin4Time                                                      -- 搬入時間
    , TblShukaGembaHanyu.Bin4HanyuButu                                      -- 搬入物
    --*** 5便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin5IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin5IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin5InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin5InitialPlanDate,TblShukaGembaHanyu.Bin5Date) AS Bin5HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin5Date                                           -- 搬入日
    , MM_Bin5Timed1.MeisyoName AS Bin5Hour                                  -- 搬入時間-時
    , MM_Bin5Timed2.MeisyoName AS Bin5Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin5Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin5Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin5Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin5Timed2.MeisyoName, '') 
      END AS Bin5Time                                                       -- 搬入時間
    , TblShukaGembaHanyu.Bin5HanyuButu                                      -- 搬入物
    --*** 6便 ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin6IsHagara,0)  WHEN 1 THEN '○' ELSE '' END  AS Bin6IsHagara             -- 羽柄含む   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin6InitialPlanDate                                -- 当初計画搬入日
    , DATEDIFF(day,TblShukaGembaHanyu.Bin6InitialPlanDate,TblShukaGembaHanyu.Bin6Date) AS Bin6HanyuDateDiff     -- 当初計画差異
    , TblShukaGembaHanyu.Bin6Date                                           -- 搬入日
    , MM_Bin6Timed1.MeisyoName AS Bin6Hour                                  -- 搬入時間-時
    , MM_Bin6Timed2.MeisyoName AS Bin6Minute                                -- 搬入時間-分
    , CASE WHEN ISNULL(MM_Bin6Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin6Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin6Timed1.MeisyoName, '') + '：' + ISNULL(MM_Bin6Timed2.MeisyoName, '') 
      END AS Bin6Time                                                       -- 搬入時間
    , TblShukaGembaHanyu.Bin6HanyuButu                                      -- 搬入物
    ----------------------------------- 2022.03.25 Add K.Kobayashi シ-22024：現場搬入一覧の自動送信メールにもシステムデータ同様に施工を追加
    , Sekou.MeisyoName AS SekouName                                         --施工
    -----------------------------------
    ----------------------------------------------------------------------------------------- 2023.02.06 Add M.Ogura シ-23016 配送延期チェック欄追加 現場搬入一覧への機能追加
    , TblShukaGembaHanyu.HaisoEnki                                          -- 配送延期
    , CASE ISNULL(TblShukaGembaHanyu.HaisoEnki, 0) WHEN 1 THEN '○' ELSE '' END AS HaisoEnkiDisp                 -- 配送延期フラグ
    -----------------------------------------------------------------------------------------
 --   -- ■送信データ
    --, TblShukaGembaHanyu.FwSendMailId                                     -- FW送信データ
    --, TblShukaGembaHanyu.ChukeiSendMailId                                 -- 中継送信データ
    --, TblShukaGembaHanyu.KojitenSendMailId                                -- 工事店送信データ
    --, TblShukaGembaHanyu.KantouSendMailId                                 -- 監督送信データ
    --, TblShukaGembaHanyu.GaichuSendMailId                                 -- 外注先送信データ
    --, TblShukaGembaHanyu.SozaiGaichuSendMailId                            -- 素材外注先送信データ
	------------------------------------------ 2023.12.21 ADD T-Ushinmei PCSUP-3561 一建設外注先　自動メールについて
	, ISNULL (dbo.GetCodeCatName (KoubaiNeda.MeisyoCd, KoubaiNeda.MeisyoName), '') AS KoubaiNedaCdName	-- 新仕様
	------------------------------------------ 
  FROM TblKoteiHeader
        INNER JOIN TblKoteiDetail
                ON TblKoteiHeader.HeaderId = TblKoteiDetail.HeaderId
        -- 出荷現場搬入
        LEFT  JOIN TblShukaGembaHanyu
                ON TblKoteiDetail.DetailId =TblShukaGembaHanyu.KoteiDetailId
        -- 1便時間
        LEFT  JOIN MstMeisyo AS MM_Bin1Timed1
                ON TblShukaGembaHanyu.Bin1Timed1 = MM_Bin1Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin1Timed2
                ON TblShukaGembaHanyu.Bin1Timed2 = MM_Bin1Timed2.MeisyoId 
        -- 2便時間
        LEFT  JOIN MstMeisyo AS MM_Bin2Timed1
                ON TblShukaGembaHanyu.Bin2Timed1 = MM_Bin2Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin2Timed2
                ON TblShukaGembaHanyu.Bin2Timed2 = MM_Bin2Timed2.MeisyoId 
        -- 3便時間
        LEFT  JOIN MstMeisyo AS MM_Bin3Timed1
                ON TblShukaGembaHanyu.Bin3Timed1 = MM_Bin3Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin3Timed2
                ON TblShukaGembaHanyu.Bin3Timed2 = MM_Bin3Timed2.MeisyoId 
        -- 4便時間
        LEFT  JOIN MstMeisyo AS MM_Bin4Timed1
                ON TblShukaGembaHanyu.Bin4Timed1 = MM_Bin4Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin4Timed2
                ON TblShukaGembaHanyu.Bin4Timed2 = MM_Bin4Timed2.MeisyoId 
        -- 5便時間
        LEFT  JOIN MstMeisyo AS MM_Bin5Timed1
                ON TblShukaGembaHanyu.Bin5Timed1 = MM_Bin5Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin5Timed2
                ON TblShukaGembaHanyu.Bin5Timed2 = MM_Bin5Timed2.MeisyoId 
        -- 6便時間
        LEFT  JOIN MstMeisyo AS MM_Bin6Timed1
                ON TblShukaGembaHanyu.Bin6Timed1 = MM_Bin6Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin6Timed2
                ON TblShukaGembaHanyu.Bin6Timed2 = MM_Bin6Timed2.MeisyoId 
        -- 取引先マスタ
        LEFT  JOIN dbo.MstTorihiki
                ON TblKoteiHeader.TorihikiId = MstTorihiki.TorihikiId
        -- 監督マスタ
        LEFT  JOIN dbo.MstKantoku
                ON TblKoteiDetail.KantokuId = MstKantoku.KantokuId
        -- 工程予定
        LEFT  JOIN dbo.TblYotei
                ON dbo.TblYotei.KoteiDetailId = TblKoteiDetail.DetailId
        -- 出荷予定
        LEFT  JOIN dbo.TblShukaYotei
                ON TblShukaYotei.KoteiDetailId = TblKoteiDetail.DetailId
        -- 出荷完了ヘッダー
        LEFT  JOIN dbo.TblShukaKanryoHeader
                ON TblShukaYotei.ShukaYoteiId = dbo.TblShukaKanryoHeader.ShukaYoteiId
        -- 完了中継
        LEFT  JOIN dbo.MstHaisoChukei AS KanryoChukei
                ON dbo.TblShukaKanryoHeader.ChukeiId = KanryoChukei.HaisoChukeiId
        -- 予定中継
        LEFT  JOIN dbo.MstHaisoChukei AS YoteiChukei
                ON YoteiChukei.HaisoChukeiId = dbo.TblShukaYotei.ChukeiId
        -- 工事店
        LEFT  JOIN dbo.MstTempo AS MstKojiten
                ON MstKojiten.TempoId = TblKoteiHeader.KoujitenId
        -- 素材外注先
        LEFT  JOIN dbo.MstKojo AS MstSozaiGaichu
                ON TblKoteiDetail.SozaiGaichuId = MstSozaiGaichu.KojoId
        -- 構造加工場
        LEFT  JOIN dbo.MstKojo AS MstKozoKojo
                ON TblKoteiDetail.KozoKojoId = MstKozoKojo.KojoId
        -- 羽柄加工場
        LEFT  JOIN dbo.MstKojo AS MstHagaraKojo
                ON TblKoteiDetail.HagaraKojoId = MstHagaraKojo.KojoId
        -- IDS合板加工場
        LEFT  JOIN dbo.MstKojo AS MstIDSGohanKojo
                ON TblKoteiDetail.IDSGohanKojoId = MstIDSGohanKojo.KojoId
        -- LVL野縁加工場
        LEFT  JOIN dbo.MstKojo AS MstLVLNobuchiKojo
                ON TblKoteiDetail.LVLNobuchiKojoId = MstLVLNobuchiKojo.KojoId
        -- 現場搬入車両
        LEFT  JOIN MstMeisyo AS HanyuSharyo
                ON TblShukaGembaHanyu.HanyuSharyoId = HanyuSharyo.MeisyoId
        -- 上棟搬入日レッカー
        LEFT  JOIN MstMeisyo  AS JotoBinWrecker
                ON TblShukaGembaHanyu.JotoBinWreckerId = JotoBinWrecker.MeisyoId 
        -- 物件基本テーブル
        LEFT  JOIN dbo.TblBukenBasic
                ON dbo.TblKoteiDetail.DetailId = dbo.TblBukenBasic.KoteiDetailId
        -- 野物 
        LEFT  JOIN dbo.MstMeisyo AS Nomono
                ON Nomono.MeisyoId = dbo.TblBukenBasic.NomonoId
        -- 現場案内図(名称マスタ)
        LEFT  JOIN dbo.MstMeisyo AS MstGenbaAnnai
                ON MstGenbaAnnai.MeisyoId = TblShukaGembaHanyu.GembaAnnaiId
        ------------------------------------------------------------ 2022.03.25 Add K.Kobayashi シ-22024：現場搬入一覧の自動送信メールにもシステムデータ同様に施工を追加
        -- 施工
        LEFT JOIN dbo.MstMeisyo AS Sekou
               ON Sekou.MeisyoId = dbo.TblBukenBasic.SekouId
        ------------------------------------------------------------
        ------------------------------
        ---- 前回データ
        ------------------------------
        ---- FW
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS FwMailData
        --        ON TblShukaGembaHanyu.FwSendMailId = FwMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS FwShukaGembaHanyuLogData
        --        ON FwMailData.ShukaGembaHanyuLogId = FwShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = FwShukaGembaHanyuLogData.KoteiDetailId
        ---- 中継
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS ChukeiMailData
        --        ON TblShukaGembaHanyu.ChukeiSendMailId = ChukeiMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS ChukeiShukaGembaHanyuLogData
        --        ON ChukeiMailData.ShukaGembaHanyuLogId = ChukeiShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = ChukeiShukaGembaHanyuLogData.KoteiDetailId
        ---- 工事店
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS KoujitenMailData
        --        ON TblShukaGembaHanyu.KojitenSendMailId = KoujitenMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS KoujitenShukaGembaHanyuLogData
        --        ON KoujitenMailData.ShukaGembaHanyuLogId = KoujitenShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = KoujitenShukaGembaHanyuLogData.KoteiDetailId
        ---- 監督
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS KantokuMailData
        --        ON TblShukaGembaHanyu.KantouSendMailId = KantokuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS KantokuShukaGembaHanyuLogData
        --        ON KantokuMailData.ShukaGembaHanyuLogId = KantokuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = KantokuShukaGembaHanyuLogData.KoteiDetailId
        ---- 外注先
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS GaichuMailData
        --        ON TblShukaGembaHanyu.GaichuSendMailId = GaichuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS GaichuShukaGembaHanyuLogData
        --        ON GaichuMailData.ShukaGembaHanyuLogId = GaichuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = GaichuShukaGembaHanyuLogData.KoteiDetailId
        ---- 工事店
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS SozaiGaichuMailData
        --        ON TblShukaGembaHanyu.SozaiGaichuSendMailId = SozaiGaichuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS SozaiGaichuShukaGembaHanyuLogData
        --        ON SozaiGaichuMailData.ShukaGembaHanyuLogId = SozaiGaichuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = SozaiGaichuShukaGembaHanyuLogData.KoteiDetailId
	    ------------------------------------------ 2023.12.21 ADD T-Ushinmei PCSUP-3561 一建設外注先　自動メールについて
		LEFT OUTER JOIN
        dbo.MstMeisyo AS KoubaiNeda
   　　　　　　　 ON  KoubaiNeda.MeisyoId = dbo.TblBukenBasic.KoubaiNedaId
   　　 ------------------------------------------


-------------------------------------------------- 20220117_シ-21226 現場搬入一覧の条件を一部変更
-- WHERE TblKoteiDetail.ShukaJotoDate IS NULL                    -- 出荷上棟日が入っていないデータのみ対象とする
 WHERE (  TblKoteiDetail.ShukaJotoDate IS NULL
       OR TblKoteiDetail.ShukaJotoDate > CONVERT ( VARCHAR, GETDATE(), 111 ))
--------------------------------------------------
GO


