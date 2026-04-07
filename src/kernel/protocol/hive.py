import socket
import struct
import json
import threading
from typing import Dict, Any

try:
    from logger import logger
    from cortex import Cortex
except ImportError:
    import sys, os
    sys.path.append(os.path.dirname(__file__))
    sys.path.append(os.path.dirname(os.path.dirname(__file__)) + "/memory")
    from logger import logger
    from cortex import Cortex

# 默认组播组和端口 (Default Multicast Group and Port)
MCAST_GRP = '224.0.0.50'
MCAST_PORT = 5050

class HiveMind:
    """
    零依赖 UDP 组播集群状态同步 (Zero-Dependency UDP Multicast Hive Synchronization)
    允许同一局域网内的不同 Nexus 实例无中心化地共享认知变更。
    (Enables decentralized sharing of cognitive updates across Nexus instances on the same LAN.)
    """
    def __init__(self, mcast_grp=MCAST_GRP, mcast_port=MCAST_PORT):
        self.mcast_grp = mcast_grp
        self.mcast_port = mcast_port
        self.cortex = Cortex()
        self._running = False
        self.listener_thread = None

    def start_listening(self):
        """开启组播监听守护线程 (Start the multicast listener daemon)"""
        if self._running: return
        self._running = True
        self.listener_thread = threading.Thread(target=self._listen_loop, daemon=True)
        self.listener_thread.start()
        logger.info(f"🐝 HiveMind awakened: Listening on {self.mcast_grp}:{self.mcast_port}")

    def _listen_loop(self):
        # 创建 UDP Socket (Create UDP Socket)
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        # 绑定端口 (Bind port)
        # 注意: 在不同的操作系统上, 绑定方式略有差异. 为了通用性, 绑定空IP
        try:
            sock.bind(('', self.mcast_port))
        except Exception as e:
            logger.error(f"HiveMind binding failed: {e}")
            return

        # 加入组播组 (Join multicast group)
        # struct ip_mreq
        mreq = struct.pack("4sl", socket.inet_aton(self.mcast_grp), socket.INADDR_ANY)
        sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

        # 接收数据循环 (Receive loop)
        while self._running:
            try:
                # UDP payload limit for safety is typically around 8KB-64KB. We read 65535.
                data, addr = sock.recvfrom(65535)
                # 防止处理自己发送的广播，这里需要简单的区分，但为了极简，我们依靠数据的一致性覆盖
                # 理想情况应加个 instance_id，这里简化处理。
                self._process_hive_signal(data.decode('utf-8'), addr)
            except Exception as e:
                if self._running:
                    logger.warning(f"HiveMind received malformed signal: {e}")

        sock.close()

    def _process_hive_signal(self, payload_str: str, source_addr):
        try:
            signal = json.loads(payload_str)
            sig_type = signal.get("type")
            data = signal.get("data")

            if not sig_type or not data: return

            # 接收到新的实体或突触，直接静默合入潜意识 (Assimilate into subconscious)
            if sig_type == "entities":
                # Save to disk is False to prevent infinite broadcast loops if Flusher picks it up again
                self.cortex.add_entities_batch(data, save_to_disk=False)
                logger.debug(f"🐝 HiveMind assimilated {len(data)} entities from {source_addr}")
            elif sig_type == "relations":
                self.cortex.connect_entities_batch(data, save_to_disk=False)
                logger.debug(f"🐝 HiveMind assimilated {len(data)} relations from {source_addr}")

        except json.JSONDecodeError:
            pass
        except Exception as e:
            logger.error(f"HiveMind assimilation error: {e}")

    def broadcast(self, sig_type: str, data: list):
        """向局域网投射记忆 (Broadcast memories to the LAN)"""
        if not data: return

        try:
            # Create a UDP socket for sending
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
            # Set TTL (Time To Live). 1 = stay on local subnet
            sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)

            payload = json.dumps({"type": sig_type, "data": data}, ensure_ascii=False)
            sock.sendto(payload.encode('utf-8'), (self.mcast_grp, self.mcast_port))

            # Explicitly close the sending socket
            sock.close()
        except Exception as e:
             logger.error(f"HiveMind broadcast failed: {e}")

    def stop(self):
        self._running = False
