CREATE TYPE "public"."roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "workspace_page" (
	"workspace_id" uuid,
	"page_id" uuid,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "page_belong_page" (
	"page_root_id" uuid,
	"page_child_id" uuid,
	"createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "page" (
	"page" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"icon_img" varchar,
	"background_img" varchar,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"age" integer NOT NULL,
	"role" "roles" DEFAULT 'user',
	"avatar" varchar,
	"bio" varchar,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tableOwner" (
	"user_id" uuid,
	"workspace_id" uuid,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"workspace" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "workspace_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "workspace_page" ADD CONSTRAINT "workspace_page_workspace_id_workspace_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("workspace") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_page" ADD CONSTRAINT "workspace_page_page_id_page_page_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("page") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_belong_page" ADD CONSTRAINT "page_belong_page_page_root_id_page_page_fk" FOREIGN KEY ("page_root_id") REFERENCES "public"."page"("page") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_belong_page" ADD CONSTRAINT "page_belong_page_page_child_id_page_page_fk" FOREIGN KEY ("page_child_id") REFERENCES "public"."page"("page") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tableOwner" ADD CONSTRAINT "tableOwner_user_id_users_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tableOwner" ADD CONSTRAINT "tableOwner_workspace_id_workspace_workspace_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("workspace") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");