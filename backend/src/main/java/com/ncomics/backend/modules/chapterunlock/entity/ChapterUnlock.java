package com.ncomics.backend.modules.chapterunlock.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.chapter.entity.Chapter;
import com.ncomics.backend.modules.wallettransaction.entity.WalletTransaction;

@Entity
    @Table(name = "chapter_unlocks", uniqueConstraints = {
        @UniqueConstraint(name = "uk_chapter_unlocks_user_chapter", columnNames = {"user_id", "chapter_id"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterUnlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private WalletTransaction transaction;

    @Column(name = "price_coin", nullable = false)
    private Integer priceCoin;

    @CreationTimestamp
    @Column(name = "unlocked_at", nullable = false, updatable = false)
    private LocalDateTime unlockedAt;
}

