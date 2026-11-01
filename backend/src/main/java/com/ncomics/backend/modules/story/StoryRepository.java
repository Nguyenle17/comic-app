package com.ncomics.backend.modules.story;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.story.entity.Story;

public interface StoryRepository extends JpaRepository<Story, Long> {
    boolean existsBySlug(String slug);

    List<Story> findByAuthorIdOrderByUpdatedAtDesc(Long authorId);
}
