-- CreateTable
CREATE TABLE "oauth_states" (
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "oauth_states_pkey" PRIMARY KEY ("state")
);
