package com.Se2.CyberWebApp.service;

import com.Se2.CyberWebApp.entity.Role;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.RoleRepository;
import com.Se2.CyberWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final String SUPER_ADMIN_ROLE = "SUPER ADMIN";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    // ── Guard ────────────────────────────────────────────────────────────────
    private boolean isSuperAdmin(User user) {
        return user.getRoleEntity() != null
                && SUPER_ADMIN_ROLE.equals(user.getRoleEntity().getName());
    }

    private void rejectIfSuperAdmin(User user) {
        if (isSuperAdmin(user)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "ACCESS DENIED: Cannot modify a Super Admin account.");
        }
    }

    // ── Queries ───────────────────────────────────────────────────────────────
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Returns all users EXCLUDING Super Admins — safe for Admin panel. */
    public List<User> getAllUsersExcludingSuperAdmin() {
        return userRepository.findAll().stream()
                .filter(u -> !isSuperAdmin(u))
                .toList();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // ── Mutations (guarded) ───────────────────────────────────────────────────
    public void banUser(Integer id) {
        userRepository.findById(id).ifPresent(user -> {
            rejectIfSuperAdmin(user);
            user.setEnabled(false);
            userRepository.save(user);
        });
    }

    public void unbanUser(Integer id) {
        userRepository.findById(id).ifPresent(user -> {
            rejectIfSuperAdmin(user);
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    public void updatePassword(Integer id, String newPassword) {
        userRepository.findById(id).ifPresent(user -> {
            rejectIfSuperAdmin(user);
            user.setPasswordHash(newPassword);
            userRepository.save(user);
        });
    }

    public void adjustCoins(Integer id, Integer amount) {
        userRepository.findById(id).ifPresent(user -> {
            rejectIfSuperAdmin(user);
            user.setCoin((user.getCoin() == null ? 0 : user.getCoin()) + amount);
            userRepository.save(user);
        });
    }

    public void updateUserRole(Integer id, String roleName) {
        Optional<User> userOpt = userRepository.findById(id);
        Optional<Role> roleOpt = roleRepository.findByName(roleName);

        if (userOpt.isPresent() && roleOpt.isPresent()) {
            User user = userOpt.get();
            user.setRoleEntity(roleOpt.get());
            userRepository.save(user);
        }
    }
}
