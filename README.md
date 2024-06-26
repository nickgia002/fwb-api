# fw_webprecut_api

<!-- envファイルの準備 -->
cp .env.sample .env

<!-- インストール -->
npm install

<!-- ビルド -->
npm run build

<!-- 起動 -->
npm run start

<!-- マイグレートファイル作成＆反映 -->
npm run db:migrate:dev

<!-- マイグレートファイル状態確認 -->
npm run db:migrate:status

<!-- マイグレートファイル状態確認 -->
npm run db:migrate:deploy

<!-- チェックサムの再作成 -->
shasum -a 256 prisma/migrations/20240403030644_add_create_update_info/migration.sql


<!-- sqlserver DB・テーブル作成 -->
.docker/dev/mssql_create_table.sql

- DBの情報からスキマーを作成する
npx prisma db pull --schema prisma/schema-mssql.prisma
npx prisma db pull --schema prisma/schema-mysql.prisma

npx prisma generate --schema prisma/schema-mssql.prisma
npx prisma generate --schema prisma/schema-mysql.prisma
