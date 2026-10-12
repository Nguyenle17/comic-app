package com.ncomics.backend.modules.wallettransaction;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.wallettransaction.entity.WalletTransaction;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
}

