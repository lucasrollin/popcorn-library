-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "ListFilm_filmId_idx" ON "ListFilm"("filmId");

-- CreateIndex
CREATE INDEX "Rating_filmId_idx" ON "Rating"("filmId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
