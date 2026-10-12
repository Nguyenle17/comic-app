package com.ncomics.backend.modules.chapter;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.chapter.entity.Chapter;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
}

