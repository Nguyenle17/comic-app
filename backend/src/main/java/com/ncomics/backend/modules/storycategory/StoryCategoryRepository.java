package com.ncomics.backend.modules.storycategory;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.storycategory.entity.StoryCategory;

public interface StoryCategoryRepository extends JpaRepository<StoryCategory, Long> {
}

