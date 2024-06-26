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

    , TblKoteiDetail.Nendo                                                  -- �N�x
    , TblKoteiDetail.StatusId                                               -- ���ID

    , TblKoteiDetail.KoujiNo                                                -- �H���ԍ�
    , TblKoteiDetail.BukenNo                                                -- �����ԍ�
    , TblKoteiHeader.GembaName                                              -- ���ꖼ��
    , TblKoteiDetail.Goutou                                                 -- ����
    , TblKoteiHeader.Tousu                                                  -- ����
    , TblKoteiDetail.Kouzo                                                  -- �\��
		-----------------------------------  2023.12.21 ADD T-Ushinmei PCSUP-3561 �ꌚ�݊O����@�������[���ɂ���
	, dbo.TblBukenBasic.NobeyukaMenseki1
	----------------------------------- 
    ----------------------------------- 2022.12.26 Add D.Suzuki �V-22158 ���p�n�p�̎����z�M���[���Ɂy�ؐ��z�̒ǉ�
    , dbo.TblBukenBasic.NobeyukaMenseki2                                    -- �ؐ�
    -----------------------------------
    , TblKoteiDetail.BukenKbnId                                             -- �����敪ID
    , TblKoteiDetail.ShukaJotoDate                                          -- �o�׏㓏��

    -- ���r���_�[
    , TblKoteiHeader.TorihikiId                                             -- �����ID
    , MstTorihiki.TorihikiName                                              -- �����(�r���_�[)

    -- ���H���X
    , MstKojiten.TempoId                AS KojitenId                        -- �H���XID
    , MstKojiten.TempoName              AS KoujitenName                     -- �H���X 
    , dbo.GetCodeCatName (MstKojiten.TempoCd, MstKojiten.TempoName) AS KojitenCdAndName             -- �H���XCD&Name
    , MstKojiten.MailAddress            AS KojitenMailAddress               -- �H���X���[���A�h���X

    -- ���ē�
    , MstKantoku.KantokuId                                                  -- �ē�ID
    , MstKantoku.KantokuSei + MstKantoku.KantokuMei AS KantokuName          -- �ē�
    , MstKantoku.Telephone              AS KantokuTel                       -- �ēd�b�ԍ�
    , MstKantoku.MailAddress            AS KantokuMailAddress               -- �ē��[���A�h���X

    -- �����p
    , ISNULL (KanryoChukei.HaisoChukeiId, YoteiChukei.HaisoChukeiId)        AS ChukeiId             -- ���pID
    , ISNULL (KanryoChukei.HaisoChukeiName, YoteiChukei.HaisoChukeiName)    AS ChukeiName           -- ���p��
    , ISNULL (KanryoChukei.MailAddress, YoteiChukei.MailAddress)            AS ChukeiMailAddress    -- ���p���[���A�h���X

    -- ���O����
    -- �\��
    , MstKozoKojo.KojoId                AS KozoKojoId                       -- �\�����H��ID
    , MstKozoKojo.KojoNameRyaku         AS KozoKojoNameRyaku                -- �\�����H�ꗪ��
    , MstKozoKojo.MailAddress           AS KozoKojoMailAddress              -- �\�����H�ꃁ�[���A�h���X
    , MstKozoKojo.IsJisha               AS KozoKojoIsJisha                  -- �\�����H��@���Ћ敪
    , ISNULL(TblShukaYotei.KouzoShukaDate1, TblShukaYotei.KouzoShukaDate2)      AS KouzoShukaDate   -- �\���o�ה���
    , ISNULL(TblShukaYotei.KouzoChukeiDate1, TblShukaYotei.KouzoChukeiDate2)    AS KouzoChukeiDate  -- �\�����p����
    -- �H��
    , MstHagaraKojo.KojoId              AS HagaraKojoId                     -- �H�����H��ID
    , MstHagaraKojo.KojoNameRyaku       AS HagaraKojoNameRyaku              -- �H�����H�ꗪ��
    , MstHagaraKojo.MailAddress         AS HagaraKojoMailAddress            -- �H�����H�ꃁ�[���A�h���X
    , MstHagaraKojo.IsJisha             AS HagaraKojoIsJisha                -- �H�����H��@���Ћ敪
    , TblShukaYotei.HagaraShukaDate                                         -- �H���o�ה���
    , TblShukaYotei.HagaraChukeiDate                                        -- �H���o�ג���
    -- IDS����
    , MstIDSGohanKojo.KojoId            AS IDSGohanKojoId                   -- IDS���H��ID
    , MstIDSGohanKojo.KojoNameRyaku     AS IDSGohanKojoNameRyaku            -- IDS���H�ꗪ��
    , MstIDSGohanKojo.MailAddress       AS IDSGohanKojoMailAddress          -- IDS���H�ꃁ�[���A�h���X
    , MstIDSGohanKojo.IsJisha           AS IDSGohanKojoIsJisha              -- IDS���H��@���Ћ敪
    -- LVL�쉏
    , MstLVLNobuchiKojo.KojoId          AS LVLNobuchiKojoId                 -- LVL�쉏�H��ID
    , MstLVLNobuchiKojo.KojoNameRyaku   AS LVLNobuchiKojoNameRyaku          -- LVL�쉏�H�ꗪ��
    , MstLVLNobuchiKojo.MailAddress     AS LVLNobuchiKojoMailAddress        -- LVL�쉏�H�ꃁ�[���A�h���X
    , MstLVLNobuchiKojo.IsJisha         AS LVLNobuchiKojoIsJisha            -- LVL�쉏�H��@���Ћ敪
    -- ���f�ފO��
    , MstSozaiGaichu.KojoId             AS SozaiGaichuId                    -- �f�ފO����ID
    , MstSozaiGaichu.KojoNameRyaku      AS SozaiGaichuNameRyaku             -- �f�ފO���旪��
    , MstSozaiGaichu.MailAddress        AS SozaiGaichuMailAddress           -- �f�ފO���惁�[���A�h���X
    , TblShukaYotei.SozaiTumikomiDate                                       -- �f�ޏo�ה���
    , TblShukaYotei.SozaiTumiorosiDate                                      -- �f�ޒ��p����

    , TblYotei.SakuzuIraiDate                                               -- ��}�˗���(�}�ʑ��M��)
    , TblYotei.KakoShoninHenkyakuDate                                       -- ���H���F���ԋp��
    , Nomono.MeisyoName                 AS NomonoName                       -- �앨
    , CASE WHEN TblShukaYotei.IsComplete = 1 THEN '����' ELSE '�\��' END AS IsCompleteName          --���ꏊ
    , TblShukaGembaHanyu.HanyuSharyoId                                      -- ��������ԗ�ID
    , HanyuSharyo.MeisyoName            AS HanyuSharyoName                  -- ��������ԗ�
    , TblShukaGembaHanyu.JotoBinWreckerId                                   -- �㓏���������b�J�[ID
    , JotoBinWrecker.MeisyoName         AS JotoBinWreckerName               -- �㓏���������b�J�[
    , dbo.TblKoteiDetail.KouzoDate1Yotei    AS KozoYotei                    -- 1F�\���\��
    , CASE ISNULL(dbo.TblKoteiDetail.IsKakuteiKouzoDate1, 0) WHEN 1 THEN '��' ELSE '' END AS IsKakutei          -- ��������\���(1F�\��)�m��t���O

    -- ������������
    , TblShukaGembaHanyu.GembaAnnaiId                                       -- ����ē��}ID
    , MstGenbaAnnai.MeisyoName          AS GembaAnnai                       -- ����ē��}
    , dbo.GetCodeCatName(MstGenbaAnnai.MeisyoCd, MstGenbaAnnai.MeisyoName)  AS GembaAnnaiCdAndName              -- ����ē��}CD&Name
    , TblShukaGembaHanyu.SharedLink                                         -- ���L�����N(����ē��})
    , TblShukaGembaHanyu.SharedLink2                                        -- ���L�����N(�w�}��)
    , TblShukaGembaHanyu.SharedLink3                                        -- ���L�����N(���̑�)
    , TblShukaGembaHanyu.Biko                                               -- ���l(�ēw��)
    , TblShukaGembaHanyu.LogiBiko                                           -- ���W���l(����)
    , TblShukaGembaHanyu.HenkoRiyu                                          -- �ύX���R
    --*** 1�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin1IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin1IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin1InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin1InitialPlanDate,TblShukaGembaHanyu.Bin1Date) AS Bin1HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin1Date                                           -- ������
    , MM_Bin1Timed1.MeisyoName AS Bin1Hour                                  -- ��������-��
    , MM_Bin1Timed2.MeisyoName AS Bin1Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin1Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin1Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin1Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin1Timed2.MeisyoName, '') 
      END AS Bin1Time                                                       -- ��������
    , TblShukaGembaHanyu.Bin1HanyuButu                                      -- ������
    --*** 2�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin2IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin2IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin2InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin2InitialPlanDate,TblShukaGembaHanyu.Bin2Date) AS Bin2HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin2Date                                           -- ������
    , MM_Bin2Timed1.MeisyoName AS Bin2Hour                                  -- ��������-��
    , MM_Bin2Timed2.MeisyoName AS Bin2Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin2Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin2Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin2Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin2Timed2.MeisyoName, '') 
      END AS Bin2Time                                                       -- ��������
    , TblShukaGembaHanyu.Bin2HanyuButu                                      -- ������
    --*** 3�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin3IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin3IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin3InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin3InitialPlanDate,TblShukaGembaHanyu.Bin3Date) AS Bin3HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin3Date                                           -- ������
    , MM_Bin3Timed1.MeisyoName AS Bin3Hour                                  -- ��������-��
    , MM_Bin3Timed2.MeisyoName AS Bin3Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin3Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin3Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin3Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin3Timed2.MeisyoName, '') 
      END AS Bin3Time                                                       -- ��������
    , TblShukaGembaHanyu.Bin3HanyuButu                                      -- ������
    --*** 4�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin4IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin4IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin4InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin4InitialPlanDate,TblShukaGembaHanyu.Bin4Date) AS Bin4HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin4Date                                           -- ������
    , MM_Bin4Timed1.MeisyoName AS Bin4Hour                                  -- ��������-��
    , MM_Bin4Timed2.MeisyoName AS Bin4Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin4Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin4Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin4Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin4Timed2.MeisyoName, '') 
       END AS Bin4Time                                                      -- ��������
    , TblShukaGembaHanyu.Bin4HanyuButu                                      -- ������
    --*** 5�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin5IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin5IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin5InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin5InitialPlanDate,TblShukaGembaHanyu.Bin5Date) AS Bin5HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin5Date                                           -- ������
    , MM_Bin5Timed1.MeisyoName AS Bin5Hour                                  -- ��������-��
    , MM_Bin5Timed2.MeisyoName AS Bin5Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin5Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin5Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin5Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin5Timed2.MeisyoName, '') 
      END AS Bin5Time                                                       -- ��������
    , TblShukaGembaHanyu.Bin5HanyuButu                                      -- ������
    --*** 6�� ***
    , CASE ISNULL(TblShukaGembaHanyu.Bin6IsHagara,0)  WHEN 1 THEN '��' ELSE '' END  AS Bin6IsHagara             -- �H���܂�   ADD 2019.08.22 K.Kobayashi
    , TblShukaGembaHanyu.Bin6InitialPlanDate                                -- �����v�������
    , DATEDIFF(day,TblShukaGembaHanyu.Bin6InitialPlanDate,TblShukaGembaHanyu.Bin6Date) AS Bin6HanyuDateDiff     -- �����v�捷��
    , TblShukaGembaHanyu.Bin6Date                                           -- ������
    , MM_Bin6Timed1.MeisyoName AS Bin6Hour                                  -- ��������-��
    , MM_Bin6Timed2.MeisyoName AS Bin6Minute                                -- ��������-��
    , CASE WHEN ISNULL(MM_Bin6Timed2.MeisyoName, '') = ''
           THEN ISNULL(MM_Bin6Timed1.MeisyoName, '')
           ELSE ISNULL(MM_Bin6Timed1.MeisyoName, '') + '�F' + ISNULL(MM_Bin6Timed2.MeisyoName, '') 
      END AS Bin6Time                                                       -- ��������
    , TblShukaGembaHanyu.Bin6HanyuButu                                      -- ������
    ----------------------------------- 2022.03.25 Add K.Kobayashi �V-22024�F��������ꗗ�̎������M���[���ɂ��V�X�e���f�[�^���l�Ɏ{�H��ǉ�
    , Sekou.MeisyoName AS SekouName                                         --�{�H
    -----------------------------------
    ----------------------------------------------------------------------------------------- 2023.02.06 Add M.Ogura �V-23016 �z�������`�F�b�N���ǉ� ��������ꗗ�ւ̋@�\�ǉ�
    , TblShukaGembaHanyu.HaisoEnki                                          -- �z������
    , CASE ISNULL(TblShukaGembaHanyu.HaisoEnki, 0) WHEN 1 THEN '��' ELSE '' END AS HaisoEnkiDisp                 -- �z�������t���O
    -----------------------------------------------------------------------------------------
 --   -- �����M�f�[�^
    --, TblShukaGembaHanyu.FwSendMailId                                     -- FW���M�f�[�^
    --, TblShukaGembaHanyu.ChukeiSendMailId                                 -- ���p���M�f�[�^
    --, TblShukaGembaHanyu.KojitenSendMailId                                -- �H���X���M�f�[�^
    --, TblShukaGembaHanyu.KantouSendMailId                                 -- �ē��M�f�[�^
    --, TblShukaGembaHanyu.GaichuSendMailId                                 -- �O���摗�M�f�[�^
    --, TblShukaGembaHanyu.SozaiGaichuSendMailId                            -- �f�ފO���摗�M�f�[�^
	------------------------------------------ 2023.12.21 ADD T-Ushinmei PCSUP-3561 �ꌚ�݊O����@�������[���ɂ���
	, ISNULL (dbo.GetCodeCatName (KoubaiNeda.MeisyoCd, KoubaiNeda.MeisyoName), '') AS KoubaiNedaCdName	-- �V�d�l
	------------------------------------------ 
  FROM TblKoteiHeader
        INNER JOIN TblKoteiDetail
                ON TblKoteiHeader.HeaderId = TblKoteiDetail.HeaderId
        -- �o�׌������
        LEFT  JOIN TblShukaGembaHanyu
                ON TblKoteiDetail.DetailId =TblShukaGembaHanyu.KoteiDetailId
        -- 1�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin1Timed1
                ON TblShukaGembaHanyu.Bin1Timed1 = MM_Bin1Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin1Timed2
                ON TblShukaGembaHanyu.Bin1Timed2 = MM_Bin1Timed2.MeisyoId 
        -- 2�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin2Timed1
                ON TblShukaGembaHanyu.Bin2Timed1 = MM_Bin2Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin2Timed2
                ON TblShukaGembaHanyu.Bin2Timed2 = MM_Bin2Timed2.MeisyoId 
        -- 3�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin3Timed1
                ON TblShukaGembaHanyu.Bin3Timed1 = MM_Bin3Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin3Timed2
                ON TblShukaGembaHanyu.Bin3Timed2 = MM_Bin3Timed2.MeisyoId 
        -- 4�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin4Timed1
                ON TblShukaGembaHanyu.Bin4Timed1 = MM_Bin4Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin4Timed2
                ON TblShukaGembaHanyu.Bin4Timed2 = MM_Bin4Timed2.MeisyoId 
        -- 5�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin5Timed1
                ON TblShukaGembaHanyu.Bin5Timed1 = MM_Bin5Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin5Timed2
                ON TblShukaGembaHanyu.Bin5Timed2 = MM_Bin5Timed2.MeisyoId 
        -- 6�֎���
        LEFT  JOIN MstMeisyo AS MM_Bin6Timed1
                ON TblShukaGembaHanyu.Bin6Timed1 = MM_Bin6Timed1.MeisyoId 
        LEFT  JOIN MstMeisyo AS MM_Bin6Timed2
                ON TblShukaGembaHanyu.Bin6Timed2 = MM_Bin6Timed2.MeisyoId 
        -- �����}�X�^
        LEFT  JOIN dbo.MstTorihiki
                ON TblKoteiHeader.TorihikiId = MstTorihiki.TorihikiId
        -- �ē}�X�^
        LEFT  JOIN dbo.MstKantoku
                ON TblKoteiDetail.KantokuId = MstKantoku.KantokuId
        -- �H���\��
        LEFT  JOIN dbo.TblYotei
                ON dbo.TblYotei.KoteiDetailId = TblKoteiDetail.DetailId
        -- �o�ח\��
        LEFT  JOIN dbo.TblShukaYotei
                ON TblShukaYotei.KoteiDetailId = TblKoteiDetail.DetailId
        -- �o�׊����w�b�_�[
        LEFT  JOIN dbo.TblShukaKanryoHeader
                ON TblShukaYotei.ShukaYoteiId = dbo.TblShukaKanryoHeader.ShukaYoteiId
        -- �������p
        LEFT  JOIN dbo.MstHaisoChukei AS KanryoChukei
                ON dbo.TblShukaKanryoHeader.ChukeiId = KanryoChukei.HaisoChukeiId
        -- �\�蒆�p
        LEFT  JOIN dbo.MstHaisoChukei AS YoteiChukei
                ON YoteiChukei.HaisoChukeiId = dbo.TblShukaYotei.ChukeiId
        -- �H���X
        LEFT  JOIN dbo.MstTempo AS MstKojiten
                ON MstKojiten.TempoId = TblKoteiHeader.KoujitenId
        -- �f�ފO����
        LEFT  JOIN dbo.MstKojo AS MstSozaiGaichu
                ON TblKoteiDetail.SozaiGaichuId = MstSozaiGaichu.KojoId
        -- �\�����H��
        LEFT  JOIN dbo.MstKojo AS MstKozoKojo
                ON TblKoteiDetail.KozoKojoId = MstKozoKojo.KojoId
        -- �H�����H��
        LEFT  JOIN dbo.MstKojo AS MstHagaraKojo
                ON TblKoteiDetail.HagaraKojoId = MstHagaraKojo.KojoId
        -- IDS�����H��
        LEFT  JOIN dbo.MstKojo AS MstIDSGohanKojo
                ON TblKoteiDetail.IDSGohanKojoId = MstIDSGohanKojo.KojoId
        -- LVL�쉏���H��
        LEFT  JOIN dbo.MstKojo AS MstLVLNobuchiKojo
                ON TblKoteiDetail.LVLNobuchiKojoId = MstLVLNobuchiKojo.KojoId
        -- ��������ԗ�
        LEFT  JOIN MstMeisyo AS HanyuSharyo
                ON TblShukaGembaHanyu.HanyuSharyoId = HanyuSharyo.MeisyoId
        -- �㓏���������b�J�[
        LEFT  JOIN MstMeisyo  AS JotoBinWrecker
                ON TblShukaGembaHanyu.JotoBinWreckerId = JotoBinWrecker.MeisyoId 
        -- ������{�e�[�u��
        LEFT  JOIN dbo.TblBukenBasic
                ON dbo.TblKoteiDetail.DetailId = dbo.TblBukenBasic.KoteiDetailId
        -- �앨 
        LEFT  JOIN dbo.MstMeisyo AS Nomono
                ON Nomono.MeisyoId = dbo.TblBukenBasic.NomonoId
        -- ����ē��}(���̃}�X�^)
        LEFT  JOIN dbo.MstMeisyo AS MstGenbaAnnai
                ON MstGenbaAnnai.MeisyoId = TblShukaGembaHanyu.GembaAnnaiId
        ------------------------------------------------------------ 2022.03.25 Add K.Kobayashi �V-22024�F��������ꗗ�̎������M���[���ɂ��V�X�e���f�[�^���l�Ɏ{�H��ǉ�
        -- �{�H
        LEFT JOIN dbo.MstMeisyo AS Sekou
               ON Sekou.MeisyoId = dbo.TblBukenBasic.SekouId
        ------------------------------------------------------------
        ------------------------------
        ---- �O��f�[�^
        ------------------------------
        ---- FW
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS FwMailData
        --        ON TblShukaGembaHanyu.FwSendMailId = FwMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS FwShukaGembaHanyuLogData
        --        ON FwMailData.ShukaGembaHanyuLogId = FwShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = FwShukaGembaHanyuLogData.KoteiDetailId
        ---- ���p
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS ChukeiMailData
        --        ON TblShukaGembaHanyu.ChukeiSendMailId = ChukeiMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS ChukeiShukaGembaHanyuLogData
        --        ON ChukeiMailData.ShukaGembaHanyuLogId = ChukeiShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = ChukeiShukaGembaHanyuLogData.KoteiDetailId
        ---- �H���X
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS KoujitenMailData
        --        ON TblShukaGembaHanyu.KojitenSendMailId = KoujitenMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS KoujitenShukaGembaHanyuLogData
        --        ON KoujitenMailData.ShukaGembaHanyuLogId = KoujitenShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = KoujitenShukaGembaHanyuLogData.KoteiDetailId
        ---- �ē�
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS KantokuMailData
        --        ON TblShukaGembaHanyu.KantouSendMailId = KantokuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS KantokuShukaGembaHanyuLogData
        --        ON KantokuMailData.ShukaGembaHanyuLogId = KantokuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = KantokuShukaGembaHanyuLogData.KoteiDetailId
        ---- �O����
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS GaichuMailData
        --        ON TblShukaGembaHanyu.GaichuSendMailId = GaichuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS GaichuShukaGembaHanyuLogData
        --        ON GaichuMailData.ShukaGembaHanyuLogId = GaichuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = GaichuShukaGembaHanyuLogData.KoteiDetailId
        ---- �H���X
        --LEFT  JOIN TblShukaGembaHanyuSendMailData AS SozaiGaichuMailData
        --        ON TblShukaGembaHanyu.SozaiGaichuSendMailId = SozaiGaichuMailData.SendMailId
        --LEFT  JOIN TblShukaGembaHanyuLog AS SozaiGaichuShukaGembaHanyuLogData
        --        ON SozaiGaichuMailData.ShukaGembaHanyuLogId = SozaiGaichuShukaGembaHanyuLogData.ShukaGembaHanyuLogId
        --       AND TblKoteiDetail.DetailId = SozaiGaichuShukaGembaHanyuLogData.KoteiDetailId
	    ------------------------------------------ 2023.12.21 ADD T-Ushinmei PCSUP-3561 �ꌚ�݊O����@�������[���ɂ���
		LEFT OUTER JOIN
        dbo.MstMeisyo AS KoubaiNeda
   �@�@�@�@�@�@�@ ON  KoubaiNeda.MeisyoId = dbo.TblBukenBasic.KoubaiNedaId
   �@�@ ------------------------------------------


-------------------------------------------------- 20220117_�V-21226 ��������ꗗ�̏������ꕔ�ύX
-- WHERE TblKoteiDetail.ShukaJotoDate IS NULL                    -- �o�׏㓏���������Ă��Ȃ��f�[�^�̂ݑΏۂƂ���
 WHERE (  TblKoteiDetail.ShukaJotoDate IS NULL
       OR TblKoteiDetail.ShukaJotoDate > CONVERT ( VARCHAR, GETDATE(), 111 ))
--------------------------------------------------
GO


