package com.ncomics.backend.modules.chapterunlock;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.chapterunlock.entity.ChapterUnlock;

public interface ChapterUnlockRepository extends JpaRepository<ChapterUnlock, Long> {
}

