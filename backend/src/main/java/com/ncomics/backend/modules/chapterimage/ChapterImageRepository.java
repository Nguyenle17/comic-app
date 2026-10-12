package com.ncomics.backend.modules.chapterimage;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.chapterimage.entity.ChapterImage;

public interface ChapterImageRepository extends JpaRepository<ChapterImage, Long> {
}

