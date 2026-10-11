package com.ncomics.backend.modules.story;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryRepository extends JpaRepository<Story, Long> {
    boolean existsBySlug(String slug);
    Optional<Story> findByIdAndAuthor(Long id, String author);
}
