package com.ncomics.backend.modules.readingprogress;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.readingprogress.entity.ReadingProgress;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
}

