package com.ncomics.backend.modules.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.comment.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}

